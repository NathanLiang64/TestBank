import { useState, useEffect } from 'react';
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
} from 'utilities/Generator';
import { showAnimationModal } from 'utilities/MessageModal';

import { createDepositPlan } from './api';
import { AlertInvalidEntry, ConfirmToTransferSubAccountBalance } from './utils/prompts';
import DetailPageWrapper from './DetailPage.style';

/**
 * C00600 存錢計畫 資訊頁
 */
const DepositPlanDetailPage = () => {
  const history = useHistory();
  const location = useLocation();
  const [mode, setMode] = useState(0);
  const [plan, setPlan] = useState();
  const [program, setProgram] = useState();

  useEffect(() => {
    if (location.state && ('isConfirmMode' in location.state)) {
      if (location.state.isConfirmMode) { // 新增確認模式
        setMode(1);
        setProgram(location.state.payload);
      } else { // 已建立資訊模式
        setMode(0);
        setPlan(location.state.plan);
      }
    } else {
      AlertInvalidEntry({ onBack: () => history.goBack() });
    }
  }, []);

  const handleImageUpload = async (planId, image) => {
    // TODO
    console.debug('handleImageUpload', planId, image);
  };

  const handleCreate = async () => {
    const payload = {...program};
    payload.extra = undefined;
    payload.authorizedKey = 'doggy'; // TODO

    const response = await createDepositPlan(payload);
    if (response?.result) {
      if (payload.imageId === 0) await handleImageUpload(response.planId);
      setMode(2);
      sessionStorage.removeItem('C006003');
      document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth'});
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
      ConfirmToTransferSubAccountBalance({ onOk: () => handleCreate, onCancel: () => history.goBack() });
    } else {
      handleCreate();
    }
  };

  const renderModeTimingString = (p) => p && (p.cycleMode === 1 ? `每週${weekNumberToChinese(p.cycleTiming === 0 ? 7 : p.cycleTiming)}` : `每月${p.cycleTiming}號`);

  const renderListItem = (list) => list.map((l) => (
    <InformationList key={uuid()} title={l.label} content={l.value} caption={l.caption} remark={l.next} extra={typeof l.extra === 'function' && l.extra()} />
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
        extra: () => (mode === 2 ? '扣款成功' : undefined),
      },
      { label: '存錢帳號', value: accountFormatter(program?.bindAccountNo) },
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
      <MainScrollWrapper>
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
