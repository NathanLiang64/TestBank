import Layout from 'components/Layout/Layout';
import { MainScrollWrapper } from 'components/Layout';
import SuccessFailureAnimations from 'components/SuccessFailureAnimations';
import InformationList from 'components/InformationList';
import { FEIBButton } from 'components/elements';

import DetailPageWrapper from './DetailPage.style';

/**
 * C00600 存錢計畫 資訊頁
 */
const DepositPlanDetailPage = () => (
  <Layout title="存款計劃資訊">
    <MainScrollWrapper>
      <DetailPageWrapper>
        <div className="px-4">
          <SuccessFailureAnimations isSuccess successTitle="設定成功" />
          <div className="info">
            <div>存錢金額與週期</div>
            <div className="text-primary text-lg balance">$20,000</div>
            <div className="text-primary text-lg">每月6號</div>
            <div className="text-primary">從主帳戶自動扣款</div>
          </div>
        </div>
        <hr />
        <div className="px-4 list">
          <InformationList title="title" content="content" />
          <InformationList title="title" content="content" />
          <InformationList title="title" content="content" />
          <InformationList title="title" content="content" />
        </div>
        <div className="px-4">
          <FEIBButton>回存錢計畫首頁</FEIBButton>
        </div>
      </DetailPageWrapper>
    </MainScrollWrapper>
  </Layout>
);

export default DepositPlanDetailPage;
