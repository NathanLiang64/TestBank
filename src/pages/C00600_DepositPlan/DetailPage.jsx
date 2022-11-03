import { useState, useEffect, useRef} from 'react';
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
  stringToDate,
  dateFormatter,
  weekNumberToChinese,
  stringDateCodeFormatter,
} from 'utilities/Generator';
import { showAnimationModal, showError } from 'utilities/MessageModal';
import { transactionAuth } from 'utilities/AppScriptProxy';

import { createDepositPlan, updateDepositPlan } from './api';
import { AlertInvalidEntry, ConfirmToTransferSubAccountBalance } from './utils/prompts';
import DetailPageWrapper from './DetailPage.style';

/**
 * C00600 存錢計畫 資訊頁
 */
const DepositPlanDetailPage = () => {
  const history = useHistory();
  const location = useLocation();
  const mainRef = useRef();
  const [mode, setMode] = useState(0);
  const [plan, setPlan] = useState();
  const [program, setProgram] = useState();

  useEffect(() => {
    if (location.state && ('isConfirmMode' in location.state)) {
      // 資訊頁有二種使用情境：確認新增存錢計畫、閱覽存錢計畫資訊。
      if (location.state.isConfirmMode) {
        // 設定成 (新增) 確認模式
        setMode(1);
        setProgram(location.state.payload);
      } else {
        // 設定成 (已建立) 資訊模式
        setMode(0);
        setPlan(location.state.plan);
      }
    } else {
      // Guard: 此頁面接續上一頁的操作，意指若未在該情況下進入此頁為不正常操作。
      AlertInvalidEntry({ onBack: () => history.goBack() });
    }
  }, []);

  const handleImageUpload = async (planId) => {
    const payload = {
      planId,
      image: sessionStorage.getItem('C00600-hero'),
    };

    await updateDepositPlan(payload);

    sessionStorage.removeItem('C00600-hero'); // 清除暫存背景圖。
  };

  const handleCreate = async () => {
    const auth = await transactionAuth(0x30); // 需通過 2FA 或 網銀密碼 驗證才能建立計劃。
    if (!auth.result) {
      await showError(auth.message);
      return;
    }

    const payload = {...program};
    delete payload.extra;
    delete payload.goalAmount;

    const response = await createDepositPlan(payload);
    if (response?.result) {
      // TODO: updateDepositPlan API 尚無法處理帶有 base64 的 image (會回傳錯誤訊息)，僅能先以預設圖片進行測試
      if (payload.imageId === 0) await handleImageUpload(response.planId);
      // 設定成 成功建立模式
      setMode(2);
      sessionStorage.removeItem('C006003'); // 清除暫存表單資料。

      // 建立成功後，將頁面滑至上方。
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth'});
    } else {
      showAnimationModal({
        isSuccess: false,
        errorTitle: '設定失敗',
        errorCode: 'E341', // TODO
        errorDesc: '親愛的客戶，因建立計畫失敗，請重新執行交易，如有疑問，請與本行客戶服務中心聯繫。',
        onClose: () => history.goBack(),
      });
    }
  };

  const handleConfirm = () => {
    if (program.currentBalance > 0) {
      // 如果所選的子帳戶有餘額，要提示用戶自動轉帳。這裡假設同支API會後端會自動處理。
      ConfirmToTransferSubAccountBalance({ onOk: () => handleCreate(), onCancel: () => history.goBack() });
    } else {
      handleCreate();
    }
  };

  const renderModeTimingString = (p) => p && (p.cycleMode === 1 ? `每週${weekNumberToChinese(p.cycleTiming === 0 ? 7 : p.cycleTiming)}` : `每月${p.cycleTiming}號`);

  const renderListItem = (list) => list.map((l) => (
    <InformationList
      key={uuid()}
      title={l.label}
      content={l.value}
      caption={l.caption}
      remark={l.next}
      extra={typeof l.extra === 'function' && l.extra()}
    />
  ));

  const renderProgramDetails = () => {
    const list = [
      { label: '存錢計畫名稱', value: program?.name },
      { label: '適用利率', value: `${program?.extra.rate}%` },
      { label: '存錢目標', value: currencySymbolGenerator('NTD', program?.goalAmount) },
      { label: '計畫期間', value: program?.extra.period },
      {
        type: 'extra',
        label: '第一筆扣款日',
        value: dateFormatter(stringToDate(program?.startDate), true),
        caption: '下一筆扣款日',
        next: program?.extra.nextDeductionDate,
        extra: () => (mode === 2 && stringDateCodeFormatter(new Date()) === program?.startDate ? '扣款成功' : undefined),
      },
      { label: '存錢帳號', value: program?.bindAccountNo ? accountFormatter(program?.bindAccountNo) : '加開子帳戶' },
    ];
    return renderListItem(list);
  };

  const renderPlanDetails = () => {
    const list = [
      { label: '存錢計畫名稱', value: plan?.name },
      { label: '存錢計畫之帳號', value: accountFormatter(plan?.bindAccountNo) },
      { label: '存錢計畫起始日', value: dateFormatter(stringToDate(plan?.startDate), true) },
      { label: '存錢計畫到期日', value: dateFormatter(stringToDate(plan?.endDate), true) },
      { label: '存錢週期', value: renderModeTimingString(plan) },
      { label: '第一筆扣款日', value: dateFormatter(stringToDate(plan?.startDate), true) },
      { label: '目標金額', value: currencySymbolGenerator('NTD', plan?.goalAmount) },
      { label: '每期存款金額', value: currencySymbolGenerator('NTD', plan?.amount) },
      { label: '利率', value: `${plan?.progInfo.rate}% (牌告+計畫加碼利率)` },
      { label: '累積存款金額', value: currencySymbolGenerator('NTD', plan?.currentBalance) },
    ];
    return renderListItem(list);
  };

  const renderTitle = () => {
    switch (mode) {
      case 0:
        return '存款計劃資訊';
      case 1:
        return '存款計劃確認';
      case 2:
      default:
        return '存款計劃設定結果';
    }
  };

  return (
    <Layout title={renderTitle()} goBackFunc={() => history.goBack()}>
      <MainScrollWrapper ref={mainRef}>
        <DetailPageWrapper>
          { mode > 0 && (
            <div className="px-4">
              { mode === 2 && <SuccessFailureAnimations isSuccess successTitle="設定成功" /> }
              <div className="info">
                <div>存錢金額與週期</div>
                <div className="text-primary text-lg balance">{currencySymbolGenerator('NTD', program?.amount)}</div>
                <div className="text-primary text-lg">{renderModeTimingString(program)}</div>
                <div className="text-primary">從主帳戶自動扣款</div>
              </div>
            </div>
          )}
          <hr />
          <div className="px-4 list">
            { mode > 0 ? renderProgramDetails() : renderPlanDetails() }
          </div>
          <div className="px-4">
            { mode === 0 && <FEIBButton onClick={() => history.push('/C006005', { plan })}>編輯</FEIBButton> }
            { mode === 1 && <FEIBButton onClick={handleConfirm}>確認</FEIBButton> }
            { mode === 2 && <FEIBButton onClick={() => history.push('/C00600')}>回存錢計畫首頁</FEIBButton> }
          </div>
        </DetailPageWrapper>
      </MainScrollWrapper>
    </Layout>
  );
};

export default DepositPlanDetailPage;
