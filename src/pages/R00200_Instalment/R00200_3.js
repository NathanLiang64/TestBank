/* eslint-disable no-unused-vars */
/** @format */
import { useHistory, useLocation } from 'react-router';

/* Elements */
import Layout from 'components/Layout/Layout';
import { FEIBButton } from 'components/elements';
import InformationList from 'components/InformationList';

/* Styles */
import { showAnimationModal } from 'utilities/MessageModal';
import { useNavigation } from 'hooks/useNavigation';
import { useDispatch } from 'react-redux';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { useEffect, useState } from 'react';
import { toCurrency } from 'utilities/Generator';
import { transactionAuth } from 'utilities/AppScriptProxy';
import { AuthCode } from 'utilities/TxnAuthCode';
import InstalmentWrapper from './R00200.style';
import { getPreCalc, updateInstallment } from './api';

/**
 * R002003 晚點付 (單筆/總額_分期設定確認)
 */
const R00200_3 = () => {
  const {state} = useLocation();
  const {goHome} = useNavigation();
  const dispatch = useDispatch();
  const [preCalc, setPreCalc] = useState();

  // NOTE 以下為 hardcode
  const staging = [
    {
      installments: '1',
      principal: 3334,
      principalText: '(首期金額)',
      interest: 0,
      amountDue: 3334,
    },
    {
      installments: '2~3',
      principal: 3334,
      principalText: '(每期金額)',
      interest: 0,
      amountDue: 3334,
    },
  ];

  const history = useHistory();

  const ResultTable = () => (
    <>
      <InformationList title="分期總額" content={state.installmentAmount} />
      <InformationList title="申請分期期數" content={state.totTerm} />
      <InformationList title="分期利率" content="待提供(年利率?)" />
    </>
  );

  // 計算單筆分期付款的試算表
  const calculateInstallment = async () => {
    const calcParam = state.param.map(({applType, ...rest}) => ({...rest}));
    const calcResult = await getPreCalc(calcParam);
    if (calcResult) {
      setPreCalc(calcResult);
    }
  };

  const renderPreCalc = () => {
    if (!preCalc) return null;
    const {
      amountFirst, amountStages, interestFirst, interestStages,
    } = preCalc;
    const arr = [
      {
        term: '第1期',
        principal: toCurrency(amountFirst),
        principalText: '首期金額',
        interest: toCurrency(interestFirst),
        amountDue: toCurrency(amountFirst + interestFirst),
      },
    ];
    // TODO 若只有設定
    if (amountStages) {
      arr.push({
        term: `第2${state.totTerm > 2 ? `~${state.totTerm}` : ''}期`,
        principal: toCurrency(amountStages),
        principalText: '每期金額',
        interest: toCurrency(interestStages),
        amountDue: toCurrency(amountStages + interestStages),
      });
    }
    return arr.map((item) => (
      <tr key={item.term}>
        <td>{item.term}</td>
        <td>
          <p>{item.principal}</p>
          <p className="principalText">{item.principalText}</p>
        </td>
        <td>{item.interest}</td>
        <td>{item.amountDue}</td>
      </tr>
    ));
  };

  const preCalcTable = () => (
    <table className="staging-table">
      <thead>
        <tr>
          <td>分期期數</td>
          <td>當期應繳本金</td>
          <td>分期利息</td>
          <td>當期應繳金額</td>
        </tr>
      </thead>
      <tbody>
        {renderPreCalc()}
        {/* {staging.map((item) => (
          <tr key={item.installments}>
            <td>
              {`第${item.installments}期`}
            </td>
            <td>
              <p>{item.principal}</p>
              <p className="principalText">{item.principalText}</p>
            </td>
            <td>{item.interest}</td>
            <td>{item.amountDue}</td>
          </tr>
        ))} */}
      </tbody>
    </table>
  );

  const onClickHandler = async () => {
    if (state?.readOnly) history.goBack();
    else {
      dispatch(setWaittingVisible(true));
      const auth = await transactionAuth(AuthCode.R00200);
      dispatch(setWaittingVisible(false));
      if (auth && auth.result) {
        dispatch(setWaittingVisible(true));
        const updateResult = await updateInstallment(state.param); // 回傳資料待確認
        dispatch(setWaittingVisible(false));
        if (updateResult) {
          showAnimationModal({
            isSuccess: updateResult.isSuccess,
            successTitle: '設定成功',
            successDesc: '您已完成Bankee信用卡晚點付申請',
            errorDesc: updateResult.message,
            onClose: () => goHome(), // TODO 待確認
          });
        }
      }
    }
  };

  useEffect(async () => {
    // 只有申請單筆分期付款才需要拿取試算表
    if (state.applType === 'G') {
      const calcParam = state.param.map(({ applType, ...rest }) => ({
        ...rest,
      }));
      dispatch(setWaittingVisible(true));
      const calcResult = await getPreCalc(calcParam);
      if (calcResult) setPreCalc(calcResult);
      dispatch(setWaittingVisible(false));
    }
  }, []);

  // if (!state) goHome();
  return (
    <Layout title="晚點付 (總額)">
      <InstalmentWrapper className="InstalmentWrapper" small>
        <form style={{gap: '2rem'}}>
          <div className="InstalmentWrapperText">各期繳款金額試算 (依實際帳單為準)</div>
          {/* 只有申請單筆分期付款才需要顯示試算表 */}
          {preCalc && preCalcTable()}
          <div className="formula-hint">
            <p>分期利息=本金餘額*(分期利率/12)</p>
            <p>小數點後數字將四捨五入至整數位</p>
          </div>
          <div className="note">實際請款金額以帳單為準</div>
          <FEIBButton type="submit" onClick={onClickHandler}>
            {state?.readOnly ? '返回' : '確認'}
          </FEIBButton>
        </form>
      </InstalmentWrapper>
    </Layout>
  );
};

export default R00200_3;
