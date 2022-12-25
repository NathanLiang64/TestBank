/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { accountFormatter, currencySymbolGenerator } from 'utilities/Generator';
import { transactionAuth } from 'utilities/AppScriptProxy';

/* Elements */
import Layout from 'components/Layout/Layout';
import InformationList from 'components/InformationList';
import { FEIBButton } from 'components/elements';

/* Styles */
import { AuthCode } from 'utilities/TxnAuthCode';
import { useDispatch } from 'react-redux';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import ForeignCurrencyTransferWrapper from './foreignCurrencyTransfer.style';
import { createTransfer } from './api';

const ForeignCurrencyTransfer1 = ({ location }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [confirmData, setConfirmData] = useState({});

  // 確認進行轉帳
  const applyTransfer = async () => {
    dispatch(setWaittingVisible(true));
    const rs = await transactionAuth(AuthCode.D00700);
    if (rs?.result) {
      const response = await createTransfer(confirmData);
      dispatch(setWaittingVisible(false));
      history.push('/foreignCurrencyTransfer2', confirmData);
    }
  };

  // 取得日期
  const getDateStr = () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const date = new Date().getDate();
    return `${year}/${month}/${date}`;
  };

  useEffect(() => {
    setConfirmData({
      ...location.state,
      dateStr: getDateStr(),
    });
  }, []);

  return (
    <Layout title="外幣轉帳確認" goBackFunc={() => history.goBack()}>
      <ForeignCurrencyTransferWrapper className="confirmAndResult">
        <div className="confrimDataContainer lighterBlueLine">
          <div className="dataLabel">轉出金額與轉入帳號</div>
          <div className="balance">
            {
              currencySymbolGenerator(confirmData?.inCcyCd)
            }
            {
              confirmData?.inAmt
            }
          </div>
          <div className="accountInfo">遠東商銀(805)</div>
          <div className="accountInfo">{ accountFormatter(confirmData?.inAcct) }</div>
        </div>
        <div className="infoListContainer">
          <div>
            <InformationList title="轉出帳號" content={accountFormatter(confirmData?.outAcct)} />
            <InformationList title="帳戶餘額" content={`${currencySymbolGenerator(confirmData?.outCcyCd)}${confirmData?.acctBalance}`} />
            <InformationList title="日期" content={confirmData?.dateStr} />
            <InformationList title="匯款性質分類" content={confirmData?.leglDesc} />
            <InformationList title="備註" content={confirmData?.memo} />
          </div>
          <div className="btnContainer">
            <FEIBButton onClick={applyTransfer}>確認</FEIBButton>
            <div className="warnText">轉帳前多思考，避免被騙更苦惱</div>
          </div>
        </div>
      </ForeignCurrencyTransferWrapper>
    </Layout>
  );
};

export default ForeignCurrencyTransfer1;
