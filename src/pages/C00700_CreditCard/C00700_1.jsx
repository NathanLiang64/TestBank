import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import parse from 'html-react-parser';

import Main from 'components/Layout';
import Loading from 'components/Loading';
import Accordion from 'components/Accordion';
import Layout from 'components/Layout/Layout';
import CreditCard from 'components/CreditCard';
import { FEIBButton } from 'components/elements';
import InformationList from 'components/InformationList';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { FuncID } from 'utilities/FuncID';
import { closeFunc, startFunc } from 'utilities/AppScriptProxy';

import { getCreditCardTerms, queryCardInfo } from './api';
import { getCardListing, getCreditListing } from './utils';
import { InfoPageWrapper } from './C00700.style';

/**
 * C00700_1 信用卡 資訊
 */
const C007001 = () => {
  // TODO location.state 參數可以被 refactor
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [cardInfo, setCardInfo] = useState();
  const [terms, setTerms] = useState();
  const cardNo = location.state?.isBankeeCard ? location.state.cards[0].cardNo : '';

  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    const cardInfoRes = await queryCardInfo(cardNo);
    setCardInfo(cardInfoRes);

    dispatch(setWaittingVisible(false));
  }, []);

  const lazyLoadTerms = async () => {
    if (!terms) setTerms(await getCreditCardTerms());
  };

  // 如果 location.state 不存在，屬於不正常行為，直接關閉該服務
  if (!location.state) return closeFunc();
  return (
    <Layout title="信用卡資訊" goBackFunc={() => history.goBack()}>
      <Main>
        <InfoPageWrapper>
          {!!cardInfo && (
          <>
            <div>
              <div>
                <CreditCard
                  cardName={location.state.isBankeeCard ? 'Bankee信用卡' : '所有信用卡'}
                  accountNo={cardNo}
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
            { terms ? parse(terms) : <Loading space="both" isCentered /> }
          </Accordion>
          <FEIBButton onClick={() => startFunc(FuncID.R00400, { cardNo })}>繳費</FEIBButton>
        </InfoPageWrapper>
      </Main>
    </Layout>
  );
};

export default C007001;
