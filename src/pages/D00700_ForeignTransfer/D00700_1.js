/* eslint-disable no-unused-vars */
import { useHistory } from 'react-router';
import { accountFormatter, currencySymbolGenerator, dateToString } from 'utilities/Generator';
import { transactionAuth } from 'utilities/AppScriptProxy';
import { Func } from 'utilities/FuncID';

/* Elements */
import Layout from 'components/Layout/Layout';
import InformationList from 'components/InformationList';
import { FEIBButton } from 'components/elements';

/* Styles */
import { useDispatch } from 'react-redux';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import ForeignCurrencyTransferWrapper from './D00700.style';
import { createTransfer, executeTransfer } from './api';

const D00700_1 = (props) => {
  const { location: {state} } = props;
  const history = useHistory();
  const dispatch = useDispatch();

  // 確認進行轉帳
  const applyTransfer = async () => {
    //  1. ======= TODO createTransfer =======
    const response = await createTransfer(state.model);

    //  2. transactionAuth
    const auth = await transactionAuth(Func.D007.authCode);
    if (!auth.result) return;

    //  3. ======= TODO executeTransfer =======
    // dispatch(setWaittingVisible(true));
    // const response = await executeTransfer(state.model);
    // dispatch(setWaittingVisible(false));
    history.push('/D007002', {});
  };

  const goBack = () => {
    const {viewModel, model} = state;
    history.replace('D00700', {model, viewModel});
  };

  const {viewModel, model} = state;
  const propertyName = viewModel.properties.find(({value}) => value === model.property).label;
  const accountBalance = viewModel.currencyList.find((item) => item.currency === model.currency).balance;

  return (
    <Layout title="外幣轉帳確認" fid={Func.D007} goBackFunc={goBack}>
      <ForeignCurrencyTransferWrapper className="confirmAndResult">
        <div className="confrimDataContainer lighterBlueLine">
          <div className="dataLabel">轉出金額與轉入帳號</div>
          <div className="balance">
            { currencySymbolGenerator(model.currency, model.amount) }

          </div>
          <div className="accountInfo">遠東商銀(805)</div>
          <div className="accountInfo">{ accountFormatter(model.inAccount, true) }</div>
        </div>
        <div className="infoListContainer">
          <div>
            <InformationList title="轉出帳號" content={accountFormatter(model.outAccount, true)} />
            <InformationList title="帳戶餘額" content={`${currencySymbolGenerator(model.currency, accountBalance)}`} />
            <InformationList title="日期" content={dateToString(new Date())} />
            <InformationList title="匯款性質分類" content={propertyName} />
            <InformationList title="備註" content={model.memo} />
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

export default D00700_1;
