/* eslint-disable no-unused-vars */
import { useRef, useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';

import Layout from 'components/Layout/Layout';
import { MainScrollWrapper } from 'components/Layout';
import SwiperLayout from 'components/SwiperLayout';

import {
  showAnimationModal, showCustomDrawer, showError,
} from 'utilities/MessageModal';
import {
  AccountIcon11, AccountIcon12, CircleIcon, D001,
} from 'assets/images/icons';
import { loadFuncParams, transactionAuth } from 'utilities/AppScriptProxy';
import { Func } from 'utilities/FuncID';
import DepositPlanHeroSlide from 'components/DepositPlanHeroSlide';
import { useNavigation } from 'hooks/useNavigation';
import { useDispatch } from 'react-redux';

import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { getAccountsList } from 'utilities/CacheData';
import EmptySlide from './components/EmptySlide';
import EmptyPlan from './components/EmptyPlan';
import DepositPlan from './components/DepositPlan';

import {getDepositPlans, updateDepositPlan, closeDepositPlan } from './api';
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
  const history = useHistory(); // TODO 應該改用 startFunc
  const dispatch = useDispatch();
  const location = useLocation();
  const {startFunc, closeFunc, goHome} = useNavigation();
  const [depositPlans, setDepositPlans] = useState();
  const swiperRef = useRef();

  // 查無主帳戶的情況下，需要跳出 popup 詢問使用者是否要導向申請頁面，
  // 若有主帳戶再查詢是否有存錢計畫
  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    const accounts = await getAccountsList('M');
    if (accounts.length) {
      if (location.state?.depositPlans) setDepositPlans(location.state?.depositPlans);
      else {
        const response = await getDepositPlans();
        setDepositPlans(response);
      }
    } else AlertNoMainAccount({onOk: () => startFunc('F00100'), closeFunc});

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
      setDepositPlans((prevState) => ({
        ...prevState,
        plans: prevState.plans.map((p) => {
          p.isMaster = false;
          if (p.planId === plan.planId) p.isMaster = true;
          return p;
        }),
      }));

      // 移動畫面顯示主要計畫
      if (swiperRef)swiperRef.current.swiper.slideTo(1);
    } else {
      AlertUpdateFail();
    }
  };

  const handleTerminatePlan = (plan) => {
    const confirmTermination = async () => {
      const {result, message} = await transactionAuth(Func.C006.authCode); // 需通過 2FA 或 網銀密碼 驗證才能關閉計劃。
      if (!result) {
        await showError(message);
        return;
      }

      const response = await closeDepositPlan({
        planId: plan.planId,
      });
      if ('email' in response) {
        ConfirmDepositPlanHasBeenClosed({ email: response.email, onOk: () => goHome() });
      } else {
        showAnimationModal({
          isSuccess: false,
          errorTitle: '設定失敗',
          errorCode: 'E341', // TODO
          errorDesc: '親愛的客戶，因關閉計畫失敗，請重新執行交易，如有疑問，請與本行客戶服務中心聯繫。',
        });
      }
    };

    PromptShouldCloseDepositPlanOrNot({ endDate: plan.endDate, onOk: confirmTermination, type: plan.progInfo.type});
  };

  const handleMoreClick = (plan) => {
    const list = [
      { icon: <CircleIcon />, title: '設定為主要存錢計畫', onClick: handleSetMasterPlan },
      { icon: <AccountIcon11 />, title: '存錢計畫資訊', onClick: () => history.push('/C006004', { isConfirmMode: false, plan }) },
      { icon: <AccountIcon12 />, title: '結束本計畫', onClick: handleTerminatePlan },
    ];
    if (plan.progInfo.type === 0) {
      list.push({ icon: <D001 />, title: '轉帳', onClick: () => startFunc(Func.D001.id) });
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

    showCustomDrawer({content: options, shouldAutoClose: true});
  };

  const handleEditClick = (plan) => {
    history.push('/C006005', { plan });
  };

  /**
   * 產生上方標題圖的 slides
   * 預設3張新增計畫頁，再替換成後端回傳的計畫，最後再把主要計畫移至中間。
   */
  const renderSlides = () => {
    const slides = Array.from({ length: 3 }, (_, i) => <EmptySlide key={i} />);
    // depositPlans
    if (depositPlans?.plans.length) {
      let masterSlideIndex = null;
      depositPlans.plans.forEach((p, i) => {
        if (p.isMaster) { masterSlideIndex = i; }
        slides[i] = (
          <DepositPlanHeroSlide
            key={p.planId}
            accountNo={p.bindAccountNo}
            onMoreClicked={() => handleMoreClick(p)}
            onEditClicked={() => handleEditClick(p)}
            {...p}
          />
        );
      });

      if (masterSlideIndex !== null) {
        // 將向陣列中 index = masterSlideIndex 的項目調至 index = 1
        [slides[masterSlideIndex], slides[1]] = [slides[1], slides[masterSlideIndex]];
      }
    }
    return slides;
  };

  /**
   * 產生下方內容時會用的
   */
  const handleAddClick = () => {
    history.push('/C006002', {depositPlans });
  };

  const handleShowDetailClick = (plan) => {
    history.push('/C006001', {plan, depositPlans});
  };

  const shouldShowUnavailableSubAccountAlert = () => {
    // totalSubAccount 若多於8組，且無可用的子帳戶時，
    if ((depositPlans?.totalSubAccountCount >= 8) && !(depositPlans?.subAccounts.length)) AlertUnavailableSubAccount();
  };

  /**
   * 產生下方內容的 slides
   * 預設3張新增計畫頁，再替換成後端回傳的計畫，最後再把主要計畫移至中間。
   */
  const renderContents = () => {
    const slides = Array.from({ length: 3 }, (_, i) => (
      <EmptyPlan
        key={i}
        onAddClick={handleAddClick}
        onMount={shouldShowUnavailableSubAccountAlert}
      />
    ));

    if (depositPlans?.plans.length) {
      let masterSlideIndex = null;
      depositPlans.plans.forEach((p, i) => {
        if (p.isMaster) { masterSlideIndex = i; }
        slides[i] = (
          <DepositPlan
            key={p.planId}
            onShowDetailClick={() => handleShowDetailClick(p)}
            onTerminatePlanClick={() => handleTerminatePlan(p)} // TODO 待測試
            {...p}
          />
        );
      });

      if (masterSlideIndex !== null) {
        [slides[masterSlideIndex], slides[1]] = [slides[1], slides[masterSlideIndex]];
      }
    }
    return slides;
  };

  /**
   * 頁面載入後，依需求切換應該顯示的計畫。
   * 如果是從別的頁面跳轉，可能會想要顯示特定的計畫，或預設顯示主要計畫。
   */
  const focusToIntentedSlide = async (swiper) => {
    let activeIndex = 1; // 預設中間

    // 重新排序plans陣列
    const reArrangedPlans = depositPlans?.plans;
    if (depositPlans?.plans.length) {
      let masterSlideIndex = null;
      depositPlans.plans.forEach((p, i) => {
        if (p.isMaster) masterSlideIndex = i;
      });

      if (masterSlideIndex !== null) {
        [reArrangedPlans[masterSlideIndex], reArrangedPlans[1]] = [reArrangedPlans[1], reArrangedPlans[masterSlideIndex]];
      }
    }

    // startParams = { focusToAccountNo: 預設開啟的存錢計劃子帳號 }
    const startParams = await loadFuncParams(); // Function Controller 提供的參數
    if (startParams && (typeof startParams === 'object')) {
      const accountNo = startParams.focusToAccountNo;
      reArrangedPlans.forEach((p, i) => {
        if (p.bindAccountNo === accountNo) activeIndex = i;
      });
    }
    swiper.slideTo(activeIndex, 0);
  };

  const handleGoBackClick = () => {
    const shouldBlockGoBack = document.querySelector('.blockGoBack');
    if (shouldBlockGoBack) {
      ConfirmNotToCloseDepositPlan(goHome);
    } else {
      closeFunc();
    }
  };

  /**
   * 產生頁面
   * 只要提供相同數量的 slides 和 content，SwiperLayout會自動切換對應的內容。
   */
  console.log('location.state', location.state);
  return (
    <Layout fid={Func.C006} title="存錢計畫" hasClearHeader goBackFunc={handleGoBackClick}>
      <MainScrollWrapper>
        <SwiperLayout
          ref={swiperRef}
          slides={renderSlides()}
          onAfterInit={focusToIntentedSlide}
        >
          { renderContents() }
        </SwiperLayout>
      </MainScrollWrapper>
    </Layout>
  );
};

export default DepositPlanPage;
