import { useState, useRef} from 'react';
import { useHistory, useLocation } from 'react-router';
import uuid from 'react-uuid';

import Layout from 'components/Layout/Layout';
import { MainScrollWrapper } from 'components/Layout';
import SuccessFailureAnimations from 'components/SuccessFailureAnimations';
import InformationList from 'components/InformationList';
import { FEIBButton } from 'components/elements';
import {
  currencySymbolGenerator,
  accountFormatter,
  dateToString,
  weekNumberToChinese,
} from 'utilities/Generator';
import { transactionAuth } from 'utilities/AppScriptProxy';

import { showAnimationModal } from 'utilities/MessageModal';
import { Func } from 'utilities/FuncID';
import { useNavigation } from 'hooks/useNavigation';
import { useDispatch } from 'react-redux';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { createConfirm, createDepositPlan, updateDepositPlan } from './api';
import { ConfirmToTransferSubAccountBalance } from './utils/prompts';
import { DetailPageWrapper } from './C00600.style';

/**
 * C00600 存錢計畫 資訊頁
 */
const DepositPlanDetailPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { closeFunc } = useNavigation();
  const mainRef = useRef();
  const {state} = useLocation();
  const {payload, plan, viewModel} = state;
  const [mode, setMode] = useState(plan ? 0 : 1); // 0=資訊模式(已建立) 1=確認模式（未建立) 2=已建立成功(剛建立完成)

  const handleImageUpload = async (planId) => {
    const request = { planId, image: sessionStorage.getItem('C00600-hero') };
    await updateDepositPlan(request);
    sessionStorage.removeItem('C00600-hero'); // 清除暫存背景圖。
  };

  const handleCreate = async () => {
    const {extra, goalAmount, ...request} = payload;
    // Step 1. 執行 存錢計畫建立
    const response = await createDepositPlan(request);
    if (!response?.result) return;

    // Step 2. 再執行 transactionAuth
    const auth = await transactionAuth(Func.C006.authCode); // 需通過 2FA 或 網銀密碼 驗證才能建立計劃。
    if (!auth.result) return;

    // Step 3. 成功後再執行 createConfirm
    dispatch(setWaittingVisible(true));
    const {result, tfrResult, message} = await createConfirm(response.planId);
    dispatch(setWaittingVisible(false));

    if (result) {
      // 驗證成功之後，若 imageId=0 再上傳自訂的影像。
      if (request.imageId === 0) await handleImageUpload(response.planId);
      state.payload = {...state.payload, tfrResult};
      setMode(2);// 設定成 成功建立模式
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth'});// 建立成功後，將頁面滑至上方。
    } else {
      showAnimationModal({
        isSuccess: false,
        errorTitle: '設定失敗',
        errorDesc: message,
        onClose: () => closeFunc(),
      });
    }
  };

  const handleConfirm = async () => {
    // 如果所選的子帳戶有餘額，要提示用戶自動轉帳。
    if (payload.currentBalance > 0) {
      const outAccount = viewModel.depositPlans.subAccounts.find(({accountNo}) => accountNo === payload.bindAccountNo);
      const inAccount = viewModel.mainAccount;
      ConfirmToTransferSubAccountBalance({ onOk: () => handleCreate(), inAccount, outAccount });
    } else handleCreate();
  };

  const renderModeTimingString = (p) => p && (p.cycleMode === 1 ? `每週${weekNumberToChinese(p.cycleTiming === 0 ? 7 : p.cycleTiming)}` : `每月${p.cycleTiming}號`);

  const renderListItem = (list) => list.map((l) => (
    <InformationList
      key={uuid()}
      title={l.label}
      content={l.value}
      caption={l.caption}
      remark={l.next}
      extra={l.extra}
      extraClassName={l.extraClassName}
    />
  ));

  const renderProgramDetails = () => {
    const generateDebitInfo = () => { // 扣款資訊
      const {tfrResult} = payload;
      if (mode !== 2 || typeof tfrResult !== 'boolean') return null;
      return tfrResult ? '扣款成功' : '扣款失敗';
    };

    const list = [
      { label: '存錢計畫名稱', value: payload.name },
      { label: '適用利率', value: `${payload.extra.rate}%` },
      { label: '存錢目標', value: currencySymbolGenerator('NTD', payload.goalAmount, true) },
      { label: '計畫期間', value: payload.extra.period },
      {
        type: 'extra',
        label: '第一筆扣款日',
        value: dateToString(payload.startDate),
        caption: '下一筆扣款日',
        next: payload.extra.nextDeductionDate,
        extra: generateDebitInfo(),
        extraClassName: payload.tfrResult ? 'text-green' : 'text-error',
      },
      { label: '存錢帳號', value: payload.bindAccountNo ? accountFormatter(payload.bindAccountNo, true) : '加開子帳戶' },
    ];
    return renderListItem(list);
  };

  const renderPlanDetails = () => {
    const list = [
      { label: '存錢計畫名稱', value: plan?.name },
      { label: '存錢計畫之帳號', value: accountFormatter(plan.bindAccountNo, true) },
      { label: '存錢計畫起始日', value: dateToString(plan.startDate) },
      { label: '存錢計畫到期日', value: dateToString(plan.endDate) },
      { label: '存錢週期', value: renderModeTimingString(plan) },
      { label: '第一筆扣款日', value: dateToString(plan.startDate) },
      { label: '目標金額', value: currencySymbolGenerator('NTD', plan.goalAmount, true) },
      { label: '每期存款金額', value: currencySymbolGenerator('NTD', plan.amount, true) },
      { label: '利率', value: `${plan.progInfo.rate}% (牌告+計畫加碼利率)` },
      { label: '累積存款金額', value: currencySymbolGenerator('NTD', plan.currentBalance, true) },
    ];
    return renderListItem(list);
  };

  const renderTitle = () => {
    switch (mode) {
      case 0: return '存款計劃資訊';
      case 1: return '存款計劃確認';
      case 2:
      default: return '存款計劃設定結果';
    }
  };

  const goBack = () => {
    if (mode === 0) history.replace('C00600', {viewModel});
    if (mode === 1) history.replace('C006003', state);
    if (mode === 2) history.push('C00600');
  };

  return (
    <Layout title={renderTitle()} fid={Func.C006} goBackFunc={goBack}>
      <MainScrollWrapper ref={mainRef}>
        <DetailPageWrapper>
          { mode > 0 && (
            <div className="px-4">
              { mode === 2 && <SuccessFailureAnimations isSuccess successTitle="設定成功" /> }
              <div className="info">
                <div>存錢金額與週期</div>
                <div className="text-primary text-lg balance">{currencySymbolGenerator('NTD', payload.amount, true)}</div>
                <div className="text-primary text-lg">{renderModeTimingString(payload)}</div>
                <div className="text-primary">從主帳戶自動扣款</div>
              </div>
            </div>
          )}
          <hr />
          <div className="px-4 list">
            { mode > 0 ? renderProgramDetails() : renderPlanDetails() }
          </div>
          <div className="px-4">
            { mode === 0 && <FEIBButton onClick={() => history.push('/C006005', state)}>編輯</FEIBButton> }
            { mode === 1 && <FEIBButton onClick={handleConfirm}>確認</FEIBButton> }
            { mode === 2 && <FEIBButton onClick={() => history.push('/C00600')}>回存錢計畫首頁</FEIBButton> }
          </div>
        </DetailPageWrapper>
      </MainScrollWrapper>
    </Layout>
  );
};

export default DepositPlanDetailPage;
