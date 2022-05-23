import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
// import { closeFunc, onVerification } from 'utilities/BankeePlus';
import { closeFunc } from 'utilities/BankeePlus';

/* Elements */
import Header from 'components/Header';
import { FEIBButton } from 'components/elements';
import InformationList from 'components/InformationList';
import Accordion from 'components/Accordion';
import { setIsOpen, setCloseCallBack, setResultContent } from 'pages/ResultDialog/stores/actions';

/* Styles */
import MobileTransferWrapper from './mobileTransfer.style';

import { createMobileNo } from './api';

const MobileTransfer2 = ({ location }) => {
  const dispatch = useDispatch();
  const history = useHistory();
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
    const { code, message, respData } = response;
    const successDesc = getSuccessDesc();
    let errorCode = code;
    let errorDesc = message;
    if (respData?.rcode === '4001') {
      dispatch(setCloseCallBack(() => closeFunc()));
    } else {
      errorCode = response.code;
      errorDesc = response.message;
      dispatch(setCloseCallBack(() => {}));
    }
    dispatch(setResultContent({
      isSuccess: respData?.rcode === '4001',
      successTitle: '設定成功',
      successDesc,
      errorTitle: '設定失敗',
      errorCode,
      errorDesc,
    }));
    dispatch(setIsOpen(true));
  };

  const modifyMobileTransferData = async (event) => {
    event.preventDefault();
    const { account, isDefault, mobile } = confirmData;
    const param = {
      actNo: account,
      bankCode: '805',
      mobilePhone: mobile,
      defaultType: isDefault ? 'Y' : 'N',
      otpCode: '123456',
      otpId: '123456',
    };
    const response = await createMobileNo(param);
    console.log(response);
    setResultDialog(response);
    // onVerification();
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
    <>
      <Header title="資料確認" goBack={goBack} />
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
    </>
  );
};

export default MobileTransfer2;
