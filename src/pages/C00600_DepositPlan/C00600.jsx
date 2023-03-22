import { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { useQLStatus } from 'hooks/useQLStatus';
import { useNavigation, loadFuncParams } from 'hooks/useNavigation';
import { setModalVisible, setWaittingVisible } from 'stores/reducers/ModalReducer';

import Layout from 'components/Layout/Layout';
import SwiperLayout from 'components/SwiperLayout';
import { MainScrollWrapper } from 'components/Layout';
import DepositPlanHeroSlide from 'components/DepositPlanHeroSlide';

import {
  AccountIcon11, AccountIcon12, CircleIcon, D001,
} from 'assets/images/icons';
import { Func } from 'utilities/FuncID';
import { getAccountsList } from 'utilities/CacheData';
import { transactionAuth } from 'utilities/AppScriptProxy';
import { showAnimationModal, showCustomDrawer, showCustomPrompt } from 'utilities/MessageModal';

import EmptyPlan from './components/EmptyPlan';
import EmptySlide from './components/EmptySlide';
import DepositPlan from './components/DepositPlan';
import {getDepositPlans, updateDepositPlan, closeDepositPlan } from './api';
import {
  AlertUpdateFail,
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
  const dispatch = useDispatch();
  const {state} = useLocation();
  const {QLResult, showUnbondedMsg} = useQLStatus();
  const {startFunc, closeFunc, goHome} = useNavigation();
  const [viewModel, setViewModel] = useState({ depositPlans: null, programs: null });
  const [disabled, setDisabled] = useState(true);
  const swiperRef = useRef();

  const fetchDepositPlans = async () => {
    const depositPlans = await getDepositPlans();
    return {depositPlans};
  };

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    const vModel = state?.viewModel || await fetchDepositPlans();
    dispatch(setWaittingVisible(false));
    setViewModel((vm) => ({...vm, ...vModel}));

    // NOTE 若是從 Webview 導向存錢計畫，在此之前就會檢核有無數位帳戶，但是在「原生彩卡首頁」沒有此機制，故仍需要檢查
    await getAccountsList('M', (accts) => {
      if (!accts.length) {
        showCustomPrompt({
          title: '溫馨提醒',
          message: '您尚未擁有 Bankee 台幣存款帳戶，是否立即申請？',
          okContent: '立即申請',
          onOk: () => window.open(`${process.env.REACT_APP_APLFX_URL}prod=Ta`, '_blank'),
          cancelContent: '我再想想',
          showCloseButton: false,
        });
      } else setDisabled(false);
    });
  }, []);

  /**
   * 產生上方標題圖時會用的
   */
  const handleSetMasterPlan = async (plan) => {
    if (plan.isMaster) {
      AlertMainDepositPlanHasBeenSetAlready();
      return;
    }

    const {isSuccess} = await updateDepositPlan({ planId: plan.planId, isMaster: true });

    if (isSuccess) {
      // 一併更新前端資料
      setViewModel((vm) => {
        const plans = vm.depositPlans.plans.map((p) => ({...p, isMaster: p.planId === plan.planId}));
        return { ...vm, depositPlans: {...vm.depositPlans, plans}};
      });
      // 移動畫面顯示主要計畫
      if (swiperRef)swiperRef.current.swiper.slideTo(1);
    } else AlertUpdateFail();
  };

  const handleTerminatePlan = (plan) => {
    const confirmTermination = async () => {
      dispatch(setModalVisible(false)); // 先關掉 modal 避免閃爍
      const {result} = await transactionAuth(Func.C006.authCode); // 需通過 2FA 或 網銀密碼 驗證才能關閉計劃。
      if (!result) return;
      dispatch(setWaittingVisible(true));
      const response = await closeDepositPlan(plan.planId);
      dispatch(setWaittingVisible(false));
      if (response.result) {
        setViewModel((vm) => {
          const plans = vm.depositPlans.plans.filter(({planId}) => planId !== plan.planId);
          return {...vm, depositPlans: {...vm.depositPlans, plans}};
        });

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
      { icon: <AccountIcon11 />, title: '存錢計畫資訊', onClick: () => history.push('/C006004', { plan, viewModel }) },
      { icon: <AccountIcon12 />, title: '結束本計畫', onClick: handleTerminatePlan },
    ];
    if (plan.progInfo.type === 0) {
      list.push({ icon: <D001 />, title: '轉帳', onClick: () => startFunc(Func.D001.id, {transOut: plan.bindAccountNo}) }); // TODO 待測
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
    history.push('/C006005', { plan, viewModel });
  };

  /**
   * 產生上方標題圖的 slides
   * 預設3張新增計畫頁，再替換成後端回傳的計畫，最後再把主要計畫移至中間。
   */
  const renderSlides = () => {
    const slides = Array.from({ length: 3 }, (_, i) => <EmptySlide key={i} />);

    if (viewModel.depositPlans?.plans.length) {
      let masterSlideIndex = null;
      viewModel.depositPlans.plans.forEach((p, i) => {
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
    if (!QLResult) showUnbondedMsg(); // 若未綁定，跳出通知
    else history.push('/C006002', {viewModel });
  };

  const handleShowDetailClick = (plan) => {
    history.push('/C006001', {plan, viewModel});
  };

  const shouldShowUnavailableSubAccountAlert = () => {
    // totalSubAccount 若多於8組，且無可用的子帳戶時，
    if ((viewModel.depositPlans?.totalSubAccountCount >= 8) && !(viewModel.depositPlans?.subAccounts.length)) AlertUnavailableSubAccount();
  };

  /**
   * 產生下方內容的 slides
   * 預設3張新增計畫頁，再替換成後端回傳的計畫，最後再把主要計畫移至中間。
   */
  const renderContents = () => {
    const slides = Array.from({ length: 3 }, (_, i) => (
      <EmptyPlan
        key={i}
        onAddClick={disabled ? null : handleAddClick} // 若 disabled 則不提供 handler，並將按鈕 disabled
        onMount={shouldShowUnavailableSubAccountAlert}
      />
    ));

    if (viewModel.depositPlans?.plans.length) {
      let masterSlideIndex = null;
      viewModel.depositPlans.plans.forEach((p, i) => {
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
    const reArrangedPlans = viewModel.depositPlans?.plans.slice(0) ?? [];
    if (viewModel.depositPlans?.plans.length) {
      const masterSlideIndex = viewModel.depositPlans.plans.findIndex((p) => !!p?.isMaster);

      if (masterSlideIndex >= 0) {
        [reArrangedPlans[masterSlideIndex], reArrangedPlans[1]] = [reArrangedPlans[1], reArrangedPlans[masterSlideIndex]];
      }
    }

    // startParams = { focusToAccountNo: 預設開啟的存錢計劃子帳號 }
    const startParams = await loadFuncParams(); // Function Controller 提供的參數
    if (startParams && (typeof startParams === 'object')) {
      const accountNo = startParams.focusToAccountNo;
      activeIndex = reArrangedPlans.findIndex((plan) => plan?.bindAccountNo === accountNo);
    }

    // state 的優先度高於 startParams
    if (state && state.plan) {
      const accountNo = state.plan.bindAccountNo;
      activeIndex = reArrangedPlans.findIndex((plan) => plan?.bindAccountNo === accountNo);
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
