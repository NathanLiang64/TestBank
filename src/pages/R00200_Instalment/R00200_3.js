/** @format */
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useNavigation } from 'hooks/useNavigation';
import { useDispatch } from 'react-redux';

/* Elements */
import Layout from 'components/Layout/Layout';
import { FEIBButton } from 'components/elements';
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
  const history = useHistory();
  const { closeFunc } = useNavigation();
  const dispatch = useDispatch();
  const [preCalc, setPreCalc] = useState();
  const [mode, setMode] = useState(state.readOnly ? 0 : 1); // 0=資訊模式(已建立) 1=確認模式（未建立) 2=已建立成功(剛建立完成)

  const InfoTable = () => {
    if (mode !== 1) return <ResultContent totTerm={state.totTerm} />;
    if (state.applType === 'H') return <TotalConfirmContent totTerm={state.totTerm} />;
    return <SingleConfirmContent totTerm={state.totTerm} installmentAmount={state.installmentAmount} />;
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
          <p>{`$${item.principal}`}</p>
          <p className="principalText">{item.principalText}</p>
        </td>
        <td>{`$${item.interest}`}</td>
        <td>{`$${item.amountDue}`}</td>
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

  const onClickHandler = async () => {
    if (mode !== 1) closeFunc();
    else {
      const {result} = await transactionAuth(Func.R00200.authCode);

      if (result) {
        dispatch(setWaittingVisible(true));
        const {isSuccess, message} = await updateInstallment(state.param); // 回傳資料待確認
        dispatch(setWaittingVisible(false));

        if (isSuccess) setMode(2);

        showAnimationModal({
          isSuccess,
          successTitle: '設定成功',
          successDesc: '您已完成Bankee信用卡晚點付申請',
          errorDesc: message,
          onClose: closeFunc, // TODO 待確認
        });
      }
    }
  };

  // 計算單筆分期付款的試算表
  const calculateInstallment = async () => {
    // 只有申請單筆分期付款才需要拿取試算表
    if (state.applType !== 'G') return;
    const calcParam = state.param.map(({ applType, ...rest }) => ({ ...rest, totTerm: parseInt(rest.totTerm, 10) }));
    dispatch(setWaittingVisible(true));
    const calcResult = await getPreCalc(calcParam);
    setPreCalc(calcResult);
    dispatch(setWaittingVisible(false));
  };

  useEffect(() => { calculateInstallment(); }, []);

  return (
    // TODO  goBackFunc 改成回傳 cache
    <Layout title="晚點付 (總額)" fid={Func.R002} goBackFunc={history.goBack}>
      <InstalmentWrapper className="InstalmentWrapper ConfirmResultPage" small>
        {mode !== 0 ? (
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
          {mode === 1 && state.applType === 'G' && preCalcTable()}

          {InfoTable()}

          {mode === 1 && (
            <div className="formula-hint">
              <p>分期利息=本金餘額*(分期利率/12)</p>
              <p>小數點後數字將四捨五入至整數位</p>
            </div>
          )}

          <div className="note">實際請款金額以帳單為準</div>

          <FEIBButton type="submit" onClick={onClickHandler}>
            {mode !== 1 ? '返回' : '確認'}
          </FEIBButton>
        </form>
      </InstalmentWrapper>
    </Layout>
  );
};

export default R00200_3;
