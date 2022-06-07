import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import uuid from 'react-uuid';

import Layout from 'components/Layout/Layout';
import { MainScrollWrapper } from 'components/Layout';
import SwiperLayout from 'components/SwiperLayout';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { closeFunc } from 'utilities/BankeePlus';
import { showAnimationModal, showDrawer, showError } from 'utilities/MessageModal';
import { AccountIcon6, RadioUncheckedIcon, TransactionIcon1 } from 'assets/images/icons';
import { transactionAuth } from 'utilities/AppScriptProxy';

import DepositPlanHeroSlide from 'components/DepositPlanHeroSlide';
import EmptySlide from './components/EmptySlide';
import EmptyPlan from './components/EmptyPlan';
import DepositPlan from './components/DepositPlan';

import { getAccountSummary } from '../C00300_NtdDeposit/api';
import { getDepositPlans, updateDepositPlan, closeDepositPlan } from './api';
import {
  AlertUpdateFail,
  AlertNoMainAccount,
  AlertMainDepositPlanHasBeenSetAlready,
  AlertUnavailableSubAccount,
  PromptShouldCloseDepositPlanOrNot,
  ConfirmDepositPlanHasBeenClosed,
  ConfirmNotToCloseDepositPlan,
} from './utils/prompts';

/**
 * C00600 存錢計畫 首頁
 */
const DepositPlanPage = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [plans, setPlans] = useState();
  const [subAccounts, setSubAccounts] = useState();
  const [totalSubAccountCount, setTotalSubAccountCount] = useState();
  const [swiperController, setSwipterController] = useState();

  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    // 檢查是否已申請主帳戶，「否」則到申請頁。
    const acctData = await getAccountSummary('M');
    if (!acctData?.length) {
      AlertNoMainAccount({onOk: () => history.goBack});
    }

    const response = await getDepositPlans();

    setPlans(response.plans);
    setSubAccounts(response.subAccounts);
    setTotalSubAccountCount(response.totalSubAccountCount);

    dispatch(setWaittingVisible(false));
  }, []);

  /**
   * 產生上方標題圖時會用的
   */
  const handleSetMasterPlan = async (plan) => {
    if (plan.isMaster) {
      AlertMainDepositPlanHasBeenSetAlready();
      return;
    }

    const response = await updateDepositPlan({
      planId: plan.planId,
      isMaster: true,
    });

    if (response.result) {
      // 一併更新前端資料
      setPlans(plans.map((p) => {
        p.isMaster = false;
        if (p.planId === plan.planId) p.isMaster = true;
        return p;
      }));

      // 移動畫面顯示主要計畫
      if (swiperController) swiperController.slideTo(1);
    } else {
      AlertUpdateFail();
    }
  };

  const handleGoBackClick = () => {
    const shouldBlockGoBack = document.querySelector('.blockGoBack');
    if (shouldBlockGoBack) {
      ConfirmNotToCloseDepositPlan();
    } else {
      closeFunc();
    }
  };

  const handleTerminatePlan = (plan) => {
    const confirmTermination = async () => {
      const auth = await transactionAuth(0x30); // 需通過 2FA 或 網銀密碼 驗證才能關閉計劃。
      if (!auth.result) {
        await showError(auth.message);
        return;
      }

      const response = await closeDepositPlan({
        planId: plan.planId,
      });
      if ('email' in response) {
        ConfirmDepositPlanHasBeenClosed({ email: response.email, onOk: () => history.push('/') });
      } else {
        showAnimationModal({
          isSuccess: false,
          errorTitle: '設定失敗',
          errorCode: 'E341', // TODO
          errorDesc: '親愛的客戶，因關閉計畫失敗，請重新執行交易，如有疑問，請與本行客戶服務中心聯繫。',
        });
      }
    };
    PromptShouldCloseDepositPlanOrNot({ endDate: plan.endDate, onOk: () => confirmTermination()});
  };

  const handleMoreClick = (plan) => {
    const list = [
      { icon: <RadioUncheckedIcon />, title: '設定為主要存錢計畫', onClick: handleSetMasterPlan },
      { icon: <AccountIcon6 />, title: '存錢計畫資訊', onClick: () => history.push('/C006004', { isConfirmMode: false, plan }) },
      { icon: <RadioUncheckedIcon />, title: '結束本計畫', onClick: handleTerminatePlan },
    ];
    if (plan.progInfo.type === 0) {
      list.push({ icon: <TransactionIcon1 />, title: '轉帳', onClick: () => history.push('/D00100') });
    }
    const options = (
      <ul>
        {list.map((func) => (
          <li key={func.title}>
            <button type="button" onClick={() => func.onClick(plan)}>
              {func.icon}
              {func.title}
            </button>
          </li>
        ))}
      </ul>
    );
    showDrawer('', options);
  };

  const handleEditClick = (plan) => {
    history.push('/C006005', { plan });
  };

  /**
   * 產生上方標題圖的 slides
   * 預設3張新增計畫頁，再替換成後端回傳的計畫，最後再把主要計畫移至中間。
   */
  const renderSlides = () => {
    const slides = Array.from({ length: 3 }, () => <EmptySlide key={uuid()} />);

    let masterSlideIndex = null;

    if (plans) {
      plans.forEach((p, i) => {
        if (p.isMaster) { masterSlideIndex = i; }
        slides[i] = (
          <DepositPlanHeroSlide
            key={uuid()}
            accountNo={p.bindAccountNo}
            onMoreClicked={() => handleMoreClick(p)}
            onEditClicked={() => handleEditClick(p)}
            {...p}
          />
        );
      });

      if (masterSlideIndex !== null) {
        const masterSlide = slides.splice(masterSlideIndex, 1)[0];
        slides.splice(1, 0, masterSlide);
      }
    }
    return slides;
  };

  /**
   * 產生下方內容時會用的
   */
  const handleAddClick = () => {
    history.push('/C006002', { plansLength: plans?.length, subAccounts, totalSubAccountCount });
  };

  const handleShowDetailClick = (plan) => {
    history.push('/C006001', { plan });
  };

  const shouldShowUnavailableSubAccountAlert = () => {
    if ((totalSubAccountCount >= 8) && !(subAccounts?.length > 0)) AlertUnavailableSubAccount();
  };

  /**
   * 產生下方內容的 slides
   * 預設3張新增計畫頁，再替換成後端回傳的計畫，最後再把主要計畫移至中間。
   */
  const renderContents = () => {
    const slides = Array.from({ length: 3 }, () => (
      <EmptyPlan
        key={uuid()}
        onAddClick={handleAddClick}
        onMount={shouldShowUnavailableSubAccountAlert}
      />
    ));

    let masterSlideIndex = null;

    if (plans) {
      plans.forEach((p, i) => {
        if (p.isMaster) { masterSlideIndex = i; }
        slides[i] = (
          <DepositPlan
            key={uuid()}
            onShowDetailClick={() => handleShowDetailClick(p)}
            {...p}
          />
        );
      });

      if (masterSlideIndex !== null) {
        const masterSlide = slides.splice(masterSlideIndex, 1)[0];
        slides.splice(1, 0, masterSlide);
      }
    }
    return slides;
  };

  /**
   * 頁面載入後，依需求切換應該顯示的計畫。
   * 如果是從別的頁面跳轉，可能會想要顯示特定的計畫，或預設顯示主要計畫。
   */
  const focusToIntentedSlide = (swiper) => {
    let activeIndex = 1; // 預設中間

    if (location.state && ('focusToAccountNo' in location.state)) {
      plans.forEach((p, i) => {
        if (p.bindAccountNo === location.state.focusToAccountNo) activeIndex = i;
      });
    }
    swiper.slideTo(activeIndex, 0);

    // Side-effect: 因為設定主計畫後會重新排序，所以必須呼叫swiper切換頁面，故存起來。
    if (!swiperController) setSwipterController(swiper);
  };

  /**
   * 產生頁面
   * 只要提供相同數量的 slides 和 content，SwiperLayout會自動切換對應的內容。
   */
  return (
    <Layout title="存錢計畫" hasClearHeader goBackFunc={handleGoBackClick}>
      <MainScrollWrapper>
        <SwiperLayout slides={renderSlides()} onAfterInit={focusToIntentedSlide}>
          { renderContents() }
        </SwiperLayout>
      </MainScrollWrapper>
    </Layout>
  );
};

export default DepositPlanPage;