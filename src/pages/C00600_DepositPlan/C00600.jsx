import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import uuid from 'react-uuid';

import Layout from 'components/Layout/Layout';
import { MainScrollWrapper } from 'components/Layout';
import SwiperLayout from 'components/SwiperLayout';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { showDrawer, showCustomPrompt } from 'utilities/MessageModal';
import { stringToDate } from 'utilities/Generator';
import {
  AccountIcon6, RadioUncheckedIcon, TransactionIcon1,
} from 'assets/images/icons';

import DepositPlanHeroSlide from 'components/DepositPlanHeroSlide';
import EmptySlide from './components/EmptySlide';
import EmptyPlan from './components/EmptyPlan';
import DepositPlan from './components/DepositPlan';

// import { getAccountSummary } from '../C00300_NtdDeposit/api';
import { getDepositPlans, updateDepositPlan } from './api';
// import { getDepositPlans, updateDepositPlan, closeDepositPlan } from './api';

/**
 * C00600 存錢計畫
 */
const DepositPlanPage = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [plans, setPlans] = useState(undefined);
  const [subAccounts, setSubAccounts] = useState(undefined);
  const [totalSubAccountCount, setTotalSubAccountCount] = useState(undefined);
  const [swiperController, setSwipterController] = useState(undefined);

  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    // 是否已申請bankee帳戶(台幣)
    const acctData = null; // await getAccountSummary('MC'); // M=台幣主帳戶、C=台幣子帳戶
    if (!acctData?.length) {
      showCustomPrompt({
        title: '新增存錢計畫',
        message: '您尚未持有Bankee存款帳戶',
        // TODO: 沒有「台幣帳戶」導去申請
        onOk: () => history.goBack(),
        okContent: '現在就來申請吧!',
      });
    }

    const response = await getDepositPlans();

    setPlans(response.plans);
    setSubAccounts(response.subAccounts);
    setTotalSubAccountCount(response.totalSubAccountCount);

    dispatch(setWaittingVisible(false));
  }, []);

  const handleEditClick = () => {
    // TODO
    console.debug('handleEditClick');
  };

  const handleSetMasterPlan = (plan) => {
    if (plan.isMaster) {
      showCustomPrompt({
        title: '設定為主要存錢計畫',
        message: '目前的計畫已設定為主要存錢計畫。',
        okContent: '了解!',
      });
    } else {
      updateDepositPlan({ planId: plan.planId, isMaster: true });
      // TODO: if failed?

      // Center the plan slide instead of fetching API again.
      setPlans(plans.map((p) => {
        p.isMaster = false;
        if (p.planId === plan.planId) p.isMaster = true;
        return p;
      }));
      if (swiperController) swiperController.slideTo(1);
    }
  };

  const handleTerminatePlan = (plan) => {
    const confirmTermination = async () => {
      // const response = await closeDepositPlan({ planId: plan.planId });
      const response = { email: 'email' };

      if ('email' in response) { // result=true 的時候有email -> 有email時是成功的。
        showCustomPrompt({
          title: '結束本計畫',
          message: `本存錢計畫已結束，存錢計畫相關資訊及存錢歷程將匯出至留存信箱${response.email}`,
          okContent: '確認',
          onOk: () => history.push('/'),
        });
      } else {
        // TODO: show error message
      }
    };

    const { endDate } = plan;
    const isPlanExpired = endDate && (stringToDate(endDate) < new Date());

    showCustomPrompt({
      title: '結束本計畫',
      message: (
        <p style={{ textAlign: 'left' }}>
          您確定要
          {!isPlanExpired && '提早'}
          結束本計畫?
          <br />
          本計畫帳上餘額將轉回主帳戶
        </p>
      ),
      okContent: '確認結束',
      cancelContent: '我再想想',
      onOk: () => confirmTermination(),
      noDismiss: true,
    });
  };

  const handleMoreClick = (plan) => {
    const list = [
      { icon: <RadioUncheckedIcon />, title: '設定為主要存錢計畫', onClick: handleSetMasterPlan },
      { icon: <AccountIcon6 />, title: '存錢計畫資訊', onClick: () => {} },
      { icon: <RadioUncheckedIcon />, title: '結束本計畫', onClick: handleTerminatePlan },
      { icon: <TransactionIcon1 />, title: '轉帳', onClick: () => {} },
    ];
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

  const handleShowDetailClick = (plan) => {
    history.push('/C006001', { plan });
  };

  const shouldShowUnavailableSubAccountAlert = () => {
    if ((totalSubAccountCount >= 8) && !(subAccounts?.length > 0)) {
      showCustomPrompt({
        title: '新增存錢計畫',
        message: '目前沒有可作為綁定存錢計畫之子帳戶，請先關閉帳本後，或先完成已進行中的存錢計畫。',
        okContent: '現在就來申請吧!',
      });
    }
  };

  const renderSlides = () => {
    const slides = Array.from({ length: 3 }, () => <EmptySlide key={uuid()} />);
    let masterSlideIndex = null;
    if (plans) {
      plans.forEach((p, i) => {
        if (p.isMaster) { masterSlideIndex = i; }
        slides[i] = (
          <DepositPlanHeroSlide
            key={uuid()}
            account={p.bindAccountNo}
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

  const renderContents = () => {
    const slides = Array.from({ length: 3 }, () => <EmptyPlan key={uuid()} onMount={shouldShowUnavailableSubAccountAlert} />);
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

  const focusToIntentedSlide = (swiper) => {
    let activeIndex = 1; // 預設中間

    // 如果從別的頁面跳轉，並欲想顯示特定計畫...
    if (location.state && ('focusToAccountNo' in location.state)) {
      plans.forEach((p, i) => {
        if (p.bindAccountNo === location.state.focusToAccountNo) activeIndex = i;
      });
    }
    swiper.slideTo(activeIndex, 0);

    // Side-effect: save swiper for later use.
    if (!swiperController) setSwipterController(swiper);
  };

  return (
    <Layout title="存錢計畫" hasClearHeader>
      <MainScrollWrapper>
        <SwiperLayout slides={renderSlides()} onAfterInit={focusToIntentedSlide}>
          { renderContents() }
        </SwiperLayout>
      </MainScrollWrapper>
    </Layout>
  );
};

export default DepositPlanPage;
