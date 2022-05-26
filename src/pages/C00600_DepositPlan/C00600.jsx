import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import uuid from 'react-uuid';

import Layout from 'components/Layout/Layout';
import { MainScrollWrapper } from 'components/Layout';
import SwiperLayout from 'components/SwiperLayout';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { showCustomPrompt } from 'utilities/MessageModal';

import DepositPlanHeroSlide from 'components/DepositPlanHeroSlide';
import EmptySlide from './components/EmptySlide';
import EmptyPlan from './components/EmptyPlan';
import DepositPlan from './components/DepositPlan';

// import { getAccountSummary } from '../C00300_NtdDeposit/api';
import { getDepositPlans } from './api';

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

    const res = await getDepositPlans();

    // 為簡化至後元件的利用，將目前金額加入計畫物件之中。
    res.plans.forEach((plan) => {
      plan.balance = res.subAccounts[plan.bindAccountNo]?.balance;
    });

    setPlans(res.plans);
    setSubAccounts(res.subAccounts);
    setTotalSubAccountCount(res.totalSubAccountCount);

    dispatch(setWaittingVisible(false));
  }, []);

  const renderSlides = () => {
    const slides = Array.from({ length: 3 }, () => <EmptySlide key={uuid()} />);
    let masterSlideIndex = null;
    if (plans) {
      plans.forEach((p, i) => {
        if (p.isMaster) { masterSlideIndex = i; }
        slides[i] = <DepositPlanHeroSlide key={uuid()} account={p.bindAccountNo} {...p} />;
      });
      if (masterSlideIndex !== null) {
        const masterSlide = slides.splice(masterSlideIndex, 1)[0];
        slides.splice(1, 0, masterSlide);
      }
    }
    return slides;
  };

  const handleShowDetailClick = (accountNo, startDate, endDate) => {
    history.push('/C006001', { focusToAccountNo: accountNo, startDate, endDate });
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

  // TODO: 如果從別的頁面跳轉，並欲想顯示特定計畫...
  const renderContents = () => {
    const slides = Array.from({ length: 3 }, () => <EmptyPlan key={uuid()} onMount={shouldShowUnavailableSubAccountAlert} />);
    let masterSlideIndex = null;
    if (plans) {
      plans.forEach((p, i) => {
        if (p.isMaster) { masterSlideIndex = i; }
        slides[i] = (
          <DepositPlan
            key={uuid()}
            onShowDetailClick={() => handleShowDetailClick(p.bindAccountNo, p.startDate, p.endDate)}
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
