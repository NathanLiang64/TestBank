import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { transactionAuth } from 'utilities/AppScriptProxy';
import { showAnimationModal } from 'utilities/MessageModal';

/* Elements */
import { FEIBButton } from 'components/elements';
import InformationList from 'components/InformationList';
import Accordion from 'components/Accordion';
import Layout from 'components/Layout/Layout';

/* Styles */
import { useNavigation } from 'hooks/useNavigation';
import MobileTransferWrapper from './T00600.style';

import { createMobileNo, editMobileNo, unbindMobileNo } from './api';

const T006002 = ({ location }) => {
  const history = useHistory();
  const { closeFunc } = useNavigation();
  const [dealCode, setDealCode] = useState('');
  const [dealType, setDealType] = useState('');
  const [isModifyConfirmPage, setIsModifyConfirmPage] = useState(true);
  const [confirmData, setConfirmData] = useState({
    id: 0,
    mobile: '',
    isDefault: false,
    account: '',
    userName: '',
  });

  const setDealTypeContent = (type) => {
    setDealCode(type);
    switch (type) {
      case 'edit':
        setDealType('手機號碼收款變更');
        break;
      case 'delete':
        setDealType('手機號碼收款取消');
        break;
      default:
        setDealType('手機號碼收款設定');
        break;
    }
  };

  const getSuccessDesc = () => {
    if (dealCode === 'delete') {
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

  // 關閉結果彈窗
  // const handleCloseResultDialog = () => {
  //   if (dealCode === 'delete' || dealCode === 'edit') {
  //     history.go(-1);
  //   } else {
  //     history.go(-1);
  //   }
  // };

  // 設定結果彈窗
  const setResultDialog = (response) => {
    showAnimationModal({
      isSuccess: response,
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
    const result = await transactionAuth(0x23, location.state.otpMobileNum);
    console.log(result);
    if (result?.result) {
      const { account, isDefault, mobile } = confirmData;
      const param = {
        account,
        mobile,
        isDefault: isDefault ? 'Y' : 'N',
        otpCode: result.otpCode,
      };
      // 新增設定
      if (!isModifyConfirmPage) {
        const response = await createMobileNo(param);
        setResultDialog(response);
      }
      // 編輯或取消設定
      if (isModifyConfirmPage) {
        if (dealType === 'edit') {
          const editResponse = await editMobileNo(param);
          setResultDialog(editResponse);
        }
        if (dealType === 'delete') {
          const deleteParam = {
            mobile,
            otpCode: result.data,
          };
          const deleteResponse = await unbindMobileNo(deleteParam);
          setResultDialog(deleteResponse);
        }
      }
    }
  };

  // 回上一頁
  const goBack = () => history.goBack();

  useEffect(() => {
    const { type, isModify, data } = location.state;
    setDealTypeContent(type);
    setIsModifyConfirmPage(isModify);
    setConfirmData(data);
  }, []);

  return (
    <Layout title="資料確認" goBackFunc={goBack}>
      <MobileTransferWrapper>
        <form>
          <div className={`confirmDataContainer lighterBlueLine ${isModifyConfirmPage && 'modifyConfirmPage'}`}>
            <div>
              <InformationList title="交易種類" content={dealType} />
              <InformationList title="姓名" content={confirmData.userName} />
              <InformationList title="手機號碼" content={confirmData.mobile} />
              <InformationList title="收款帳號" content={confirmData.account} />
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
