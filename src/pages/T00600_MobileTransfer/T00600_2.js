import { useState } from 'react';
import { useHistory } from 'react-router';
import { transactionAuth } from 'utilities/AppScriptProxy';
import { showAnimationModal } from 'utilities/MessageModal';
import { accountFormatter } from 'utilities/Generator';

/* Elements */
import { FEIBButton } from 'components/elements';
import InformationList from 'components/InformationList';
import Accordion from 'components/Accordion';
import Layout from 'components/Layout/Layout';
import { Func } from 'utilities/FuncID';
/* Styles */
import { useNavigation } from 'hooks/useNavigation';
import { useDispatch } from 'react-redux';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import MobileTransferWrapper from './T00600.style';

import { createMobileNo, editMobileNo, unbindMobileNo } from './api';

const T006002 = ({ location }) => {
  const { type, isModify, data } = location.state;

  const history = useHistory();
  const dispatch = useDispatch();

  const { closeFunc } = useNavigation();
  const [isModifyConfirmPage] = useState(isModify);
  const [confirmData] = useState(data);

  const getDealTypeContent = (txnType) => {
    switch (txnType) {
      case 'edit': return '手機號碼收款變更';
      case 'delete': return '手機號碼收款取消';
      default: return '手機號碼收款設定';
    }
  };

  const getSuccessDesc = () => {
    if (type === 'delete') {
      return '';
    }
    return (
      <>
        <p style={{ color: '#666', fontSize: '1.6rem', marginBottom: '1.6rem' }}>請注意！</p>
        <p>
          僅限有開辦手機號碼服務的銀行才能轉帳至此帳戶。
          <span style={{ color: '#FF5F5F' }}>請記得使用以下銀行的手機號碼轉帳功能才可能進行轉帳：</span>
        </p>
        <p>遠東、台灣、土地、合作金庫、第一、華南、彰化、上海、高雄、兆豐、台中、京城、陽信、三信、花蓮二信、聯邦、元大、永豐、玉山及凱基，共20家銀行。</p>
      </>
    );
  };

  // 設定結果彈窗
  const setResultDialog = async (isSuccess) => {
    await showAnimationModal({
      isSuccess,
      successTitle: '設定成功',
      successDesc: getSuccessDesc(),
      errorTitle: '設定失敗',
      errorCode: '',
      errorDesc: '',
      onClose: () => closeFunc(),
    });
  };

  const modifyMobileTransferData = async (event) => {
    event.preventDefault();
    // 透過 APP 發送及驗證 OTP，並傳回結果。
    const result = await transactionAuth(Func.T00600.authCode, confirmData.mobile);
    if (result?.result) {
      dispatch(setWaittingVisible(true));
      const { account, isDefault } = confirmData;
      // 新增設定
      if (!isModifyConfirmPage) {
        const response = await createMobileNo({ accountNo: account, isDefault });
        setResultDialog(response);
      }
      // 編輯或取消設定
      if (isModifyConfirmPage) {
        if (type === 'edit') {
          const editResponse = await editMobileNo(account);
          setResultDialog(editResponse);
        }
        if (type === 'delete') {
          const deleteResponse = await unbindMobileNo();
          setResultDialog(deleteResponse);
        }
      }
      dispatch(setWaittingVisible(false));
    }
  };

  // 回上一頁
  const goBack = () => history.goBack();

  return (
    <Layout title="資料確認" goBackFunc={goBack}>
      <MobileTransferWrapper>
        <form>
          <div className={`confirmDataContainer lighterBlueLine ${isModifyConfirmPage && 'modifyConfirmPage'}`}>
            <div>
              <InformationList title="交易種類" content={getDealTypeContent(type)} />
              <InformationList title="姓名" content={confirmData.custName || ''} />
              <InformationList title="手機號碼" content={confirmData.mobile} />
              <InformationList title="收款帳號" content={accountFormatter(confirmData.account, true)} />
              <InformationList title="預設收款帳戶" content={confirmData.isDefault ? '是' : '否'} />
            </div>
            {
              isModifyConfirmPage && (
                <Accordion>
                  <ol>
                    <li>一個手機號碼僅能設定一組存款帳號，若重複設定，將取消舊設定，改採新設定。</li>
                    <li>若欲設定帳號已被其他手機號碼設定，請先取消後再進行設定。</li>
                  </ol>
                </Accordion>
              )
            }
          </div>
          <FEIBButton
            onClick={modifyMobileTransferData}
          >
            確認
          </FEIBButton>
        </form>
      </MobileTransferWrapper>
    </Layout>
  );
};

export default T006002;
