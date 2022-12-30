/* eslint-disable no-unused-vars */
/** @format */

import { useHistory, useLocation } from 'react-router';

/* Elements */
import successImg from 'assets/images/successImg.svg';
import Layout from 'components/Layout/Layout';
import { FEIBButton } from 'components/elements';
import InformationList from 'components/InformationList';

/* Styles */
import theme from 'themes/theme';
import { showAnimationModal, showInfo } from 'utilities/MessageModal';
import { useNavigation } from 'hooks/useNavigation';
import { useDispatch } from 'react-redux';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import InstalmentWrapper from './R00200.style';
import { updateInstallment } from './api';
import { interestRateMap } from './utils';
/**
 * R002003 晚點付 (單筆/總額_分期設定確認)
 */
const R00200_3 = () => {
  const {state} = useLocation();
  const {goHome} = useNavigation();
  const dispatch = useDispatch();

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
      <InformationList title="分期利率" content="待提供" />
    </>
  );

  const calculateInstallment = (installmentAmount, totTerm) => {
    const {monthlyRate, annualRate} = interestRateMap[totTerm];
    // ??? installmentAmount * rate..... 需要公式
    return [
      {
        term: '第N期', principal: '應繳本金', principalText: '應繳本金補充文字', interest: '分期利息', amountDue: '應繳金額',
      },
    ];
  };

  const stagingTable = () => (
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
        {/* 計算公式待確認 */}
        {staging.map((item) => (
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
        ))}
      </tbody>
    </table>
  );

  const onClickHandler = async () => {
    if (state.readOnly) history.goBack();
    else {
      dispatch(setWaittingVisible(true));
      const res = await updateInstallment(state.param); // 回傳資料待確認
      if (res) {
        showAnimationModal({
          isSuccess: true,
          successTitle: '設定成功',
          successDesc: '您已完成Bankee信用卡晚點付申請',
        });
      }
      dispatch(setWaittingVisible(false));
    }
  };

  // if (!state) goHome();
  return (
    <Layout title="晚點付 (總額)">
      <InstalmentWrapper className="InstalmentWrapper" small>
        <form>
          <div>
            <div className="InstalmentWrapperText">各期繳款金額試算 (依實際帳單為準)</div>
            {/* {ResultTable()} */}
            {stagingTable()}
            <div className="formula-hint">
              <p>分期利息=本金餘額*(分期利率/12)</p>
              <p>小數點後數字將四捨五入至整數位</p>
            </div>
          </div>
          <FEIBButton type="submit" onClick={onClickHandler}>
            {state.readOnly ? '返回' : '確認'}
          </FEIBButton>
        </form>
      </InstalmentWrapper>
    </Layout>
  );
};

export default R00200_3;
