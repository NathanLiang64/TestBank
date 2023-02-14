import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useDispatch } from 'react-redux';

import Main from 'components/Layout';
import Accordion from 'components/Accordion';
import Layout from 'components/Layout/Layout';
import CreditCard from 'components/CreditCard';
import { FEIBButton } from 'components/elements';
import InformationList from 'components/InformationList';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { Func } from 'utilities/FuncID';

import { useNavigation } from 'hooks/useNavigation';
import { getCreditCardTerms, queryCardInfo } from './api';
import { getCardListing, getCreditListing } from './utils';
import { InfoPageWrapper } from './C00700.style';

/**
 * C00700_1 信用卡 資訊
 */
const C007001 = () => {
  const history = useHistory();
  const {state} = useLocation();
  const {keepData, isBankeeCard, cardNo} = state;
  const dispatch = useDispatch();
  const {startFunc } = useNavigation();
  const [cardInfo, setCardInfo] = useState();
  const [terms, setTerms] = useState();

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    const cardInfoRes = await queryCardInfo('');
    setCardInfo(cardInfoRes);
    dispatch(setWaittingVisible(false));
  }, []);

  const lazyLoadTerms = async () => {
    if (!terms) setTerms(await getCreditCardTerms());
  };

  const goBack = () => history.replace('/C00700', keepData);

  return (
    <Layout title="信用卡資訊" goBackFunc={goBack}>
      <Main>
        <InfoPageWrapper>
          {!!cardInfo && (
          <>
            <div>
              <div>
                <CreditCard
                  cardName={isBankeeCard ? 'Bankee信用卡' : '所有信用卡'}
                  accountNo={isBankeeCard ? cardNo : ''}
                  color="green"
                  annotation="已使用額度"
                  balance={cardInfo?.usedCardLimit}
                />
              </div>
            </div>
            <div>
              {getCardListing(cardInfo).map((d) => <InformationList key={d.key} {...d} />)}
              <hr />
            </div>
            <div className="heading">額度資訊</div>
            <div>
              {getCreditListing(cardInfo).map((d) => <InformationList key={d.key} {...d} />)}
              <hr />
            </div>
          </>
          )}

          <Accordion className="mb-4" title="注意事項" onClick={lazyLoadTerms}>
            <ol>
              <li>本額度僅供線上參考，本行保留交易授權與否之權利，正確消費金額請依月結帳單為準</li>
              <li>臨時額度調高不可用預借現金等交易</li>
              <li>若針對特定卡片已設定單獨卡片額度，欲查詢卡片可用額度，請洽本行客服中心轉接專人查詢</li>
            </ol>
          </Accordion>
          <FEIBButton onClick={() => startFunc(Func.R004.id)}>繳費</FEIBButton>
        </InfoPageWrapper>
      </Main>
    </Layout>
  );
};

export default C007001;
