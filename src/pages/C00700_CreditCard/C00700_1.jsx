import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';

import { MainScrollWrapper } from 'components/Layout';
import Accordion from 'components/Accordion';
import Layout from 'components/Layout/Layout';
import CreditCard from 'components/CreditCard';
import { FEIBButton } from 'components/elements';
import InformationList from 'components/InformationList';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { Func } from 'utilities/FuncID';

import { useNavigation } from 'hooks/useNavigation';
import SwiperLayout from 'components/SwiperLayout';
import { queryCardInfo } from './api';
import { getCardListing, getCreditListing, creditFormatter } from './utils';
import { ContentWrapper, InfoPageWrapper } from './C00700.style';

/**
 * C00700_1 信用卡 資訊
 */
const C007001 = (props) => {
  const history = useHistory();
  const {location: {state}} = props;
  const {viewModel, isBankeeCard} = state;

  const dispatch = useDispatch();
  const {startFunc } = useNavigation();
  const [cardInfo, setCardInfo] = useState();

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    const cardInfoRes = await queryCardInfo('');
    setCardInfo(cardInfoRes);
    dispatch(setWaittingVisible(false));
  }, []);

  const goBack = () => history.replace('/C00700', viewModel);

  const renderSlides = () => {
    if (!viewModel) return [];
    return (
      <CreditCard
        cardName={isBankeeCard ? 'Bankee信用卡' : '所有信用卡'}
        accountNo={creditFormatter(isBankeeCard ? viewModel.bankeeCardNo : '')}
        color="green"
        annotation="已使用額度"
        balance={cardInfo?.usedCardLimit}
        fixHeight
      />
    );
  };

  // 信用卡明細總覽
  const renderCreditList = () => {
    if (!cardInfo) return null;
    return (
      <ContentWrapper>
        <div>
          {getCardListing(cardInfo).map((d) => <InformationList key={d.key} {...d} />)}
          <hr />
        </div>
        <div className="heading">額度資訊</div>
        <div>
          {getCreditListing(cardInfo).map((d) => <InformationList key={d.key} {...d} />)}
          <hr />
        </div>

        <Accordion className="mb-4" title="注意事項">
          <ol>
            <li>本額度僅供線上參考，本行保留交易授權與否之權利，正確消費金額請依月結帳單為準</li>
            <li>臨時額度調高不可用預借現金等交易</li>
            <li>若針對特定卡片已設定單獨卡片額度，欲查詢卡片可用額度，請洽本行客服中心轉接專人查詢</li>
          </ol>
        </Accordion>
        <FEIBButton onClick={() => startFunc(Func.R004.id)}>繳費</FEIBButton>
      </ContentWrapper>
    );
  };

  return (
    <Layout title="信用卡資訊" goBackFunc={goBack}>
      <MainScrollWrapper>
        <InfoPageWrapper>
          <SwiperLayout
            slides={renderSlides()}
            hasDivider={false}
            slidesPerView={1.06}
            spaceBetween={8}
            centeredSlides
          >
            {renderCreditList()}
          </SwiperLayout>

        </InfoPageWrapper>
      </MainScrollWrapper>
    </Layout>
  );
};

export default C007001;
