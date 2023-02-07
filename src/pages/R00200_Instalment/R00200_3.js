/* eslint-disable no-unused-vars */
/** @format */
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useNavigation } from 'hooks/useNavigation';
import { useDispatch } from 'react-redux';

/* Elements */
import Layout from 'components/Layout/Layout';
import { FEIBButton } from 'components/elements';
import InformationList from 'components/InformationList';
import { Func } from 'utilities/FuncID';
import { transactionAuth } from 'utilities/AppScriptProxy';
import { toCurrency } from 'utilities/Generator';

/* Styles */
import { showAnimationModal } from 'utilities/MessageModal';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { getPreCalc, updateInstallment } from './api';
import InstalmentWrapper from './R00200.style';
import { ResultContent, SingleConfirmContent, TotalConfirmContent } from './utils';

/**
 * R002003 晚點付 (單筆/總額_分期設定確認)
 */
const R00200_3 = () => {
  const { state } = useLocation();
  const { closeFunc } = useNavigation();
  const dispatch = useDispatch();
  const [preCalc, setPreCalc] = useState();
  const [isConfirmed, setIsConfirmed] = useState(false);

  const InfoTable = () => {
    if (state.readOnly || isConfirmed) return <ResultContent state={state} />;
    if (state.applType === '2') return <TotalConfirmContent state={state} />;
    return <SingleConfirmContent state={state} />;
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

  const preCalcTable = () => {
    if (!preCalc) return null;
    return (
      <table className="staging-table">
        <thead>
          <tr>
            <td>分期期數</td>
            <td>當期應繳本金</td>
            <td>分期利息</td>
            <td>當期應繳金額</td>
          </tr>
        </thead>
        <tbody>{renderPreCalc()}</tbody>
      </table>
    );
  };
  console.log('state', state);
  const onClickHandler = async () => {
    // if (state?.readOnly) history.goBack();
    if (state?.readOnly) closeFunc();
    else {
      dispatch(setWaittingVisible(true));
      const auth = await transactionAuth(Func.R00200.authCode);
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
            onClose: closeFunc, // TODO 待確認
          });
        }
      }
    }
  };

  // 計算單筆分期付款的試算表
  const calculateInstallment = async () => {
    dispatch(setWaittingVisible(true));
    const calcParam = state.param.map(({ applType, ...rest }) => ({ ...rest }));
    const calcResult = await getPreCalc(calcParam);
    setPreCalc(calcResult);
    dispatch(setWaittingVisible(false));
  };

  useEffect(() => {
    // 只有申請單筆分期付款才需要拿取試算表
    if (state.applType === 'G') calculateInstallment();
  }, []);

  return (
    <Layout title="晚點付 (總額)">
      <InstalmentWrapper className="InstalmentWrapper ConfirmResultPage" small>
        {!state.readOnly || !isConfirmed ? (
          <div className="InstalmentWrapperText">
            各期繳款金額試算 (依實際帳單為準)
          </div>
        ) : (
          <div className="lighterBlueLine InformSection">
            <div>您已申請Bankee晚點付</div>
            <div>如需更改請洽客戶服務專線</div>
            <div>(02)8073-1166</div>
          </div>
        )}

        <form className="ConfirmForm">
          {/* 只有申請單筆分期付款才需要顯示試算表 */}
          {!isConfirmed && state.applType === 'G' && preCalcTable()}

          {InfoTable()}

          {!state.readOnly && !isConfirmed && (
            <div className="formula-hint">
              <p>分期利息=本金餘額*(分期利率/12)</p>
              <p>小數點後數字將四捨五入至整數位</p>
            </div>
          )}

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
