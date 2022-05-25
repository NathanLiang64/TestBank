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

import { getAccountSummary } from '../C00300_NtdDeposit/api';
import { getDepositPlans } from './api';

const renderSlides = (plans) => {
  const slides = Array.from({ length: 3 }, () => <EmptySlide key={uuid()} />);
  if (plans) {
    plans.forEach((p, i) => {
      slides[i] = <DepositPlanHeroSlide key={uuid()} account={p.bindAccountNo} {...p} />;
    });
  }
  return slides;
};

const renderContents = (plans) => {
  const slides = Array.from({ length: 3 }, () => <EmptyPlan key={uuid()} />);
  if (plans) {
    plans.forEach((p, i) => {
      const currentValue = p.amount / 10000;
      slides[i] = <DepositPlan key={uuid()} currentValue={currentValue} expireDate={p.endDate} {...p} />;
    });
  }
  return slides;
};

/**
 * C00600 存錢計畫
 */
const DepositPlanPage = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [plans, setPlans] = useState(undefined);

  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    // 是否已申請bankee帳戶(台幣)
    const acctData = await getAccountSummary('MC'); // M=台幣主帳戶、C=台幣子帳戶
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

    // 如果從別的頁面跳轉，並欲想顯示特定計畫...
    if ('focusToAccountNo' in location.state) {
      // TODO
      console.debug('do something with accountNo', location.state.focusToAccountNo);
    }

    setPlans(res.plans);

    dispatch(setWaittingVisible(false));
  }, []);

  return (
    <Layout title="存錢計畫" hasClearHeader>
      <MainScrollWrapper>
        <SwiperLayout slides={renderSlides(plans)}>
          { renderContents(plans) }
        </SwiperLayout>
      </MainScrollWrapper>
    </Layout>
  );
};

export default DepositPlanPage;
