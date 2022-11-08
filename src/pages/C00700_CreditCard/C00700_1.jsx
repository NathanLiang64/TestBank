/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import parse from 'html-react-parser';
import uuid from 'react-uuid';

import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { FEIBButton } from 'components/elements';
import Main from 'components/Layout';
import Layout from 'components/Layout/Layout';
import InformationList from 'components/InformationList';
import Accordion from 'components/Accordion';
import Loading from 'components/Loading';
import CreditCard from 'components/CreditCard';

// eslint-disable-next-line no-unused-vars
import { getCreditCardTerms, queryCardInfo } from './api';
import PageWrapper from './Details.style';
import { getCardListing, getCreditListing } from './utils';

/**
 * C00700_1 信用卡 資訊
 */
const C007001 = () => {
  const history = useHistory();
  const location = useLocation();
  const [cardInfo, setCardInfo] = useState();
  const [terms, setTerms] = useState();
  const dispatch = useDispatch();

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    // Fix API queryCardInfo API 取代 getCreditCardDetails
    const infoResponse = await queryCardInfo();
    setCardInfo(infoResponse.data);
    dispatch(setWaittingVisible(false));
  }, []);

  const lazyLoadTerms = async () => {
    if (!terms) setTerms(await getCreditCardTerms());
  };

  return (
    <Layout title="信用卡資訊" goBackFunc={() => history.goBack()}>
      <Main>
        <PageWrapper>
          {!!cardInfo && (
          <>
            <div>
              <div>
                <CreditCard
                  // cardInfo 尚無該資訊
                  cardName="等待提供 cardName "
                  // cardName={details?.type === 'bankee' ? 'Bankee信用卡' : '所有信用卡'}
                  accountNo="等待提供 accountNo "
                  color="green"
                  annotation="已使用額度"
                  balance={cardInfo?.usedCardLimit}
                />
              </div>
            </div>
            <div>
              {getCardListing(cardInfo).map((d) => <InformationList key={uuid()} {...d} />)}
              <hr />
            </div>
            <div className="heading">額度資訊</div>
            <div>
              {getCreditListing(cardInfo).map((d) => <InformationList key={uuid()} {...d} />)}
              <hr />
            </div>
          </>
          )}

          <Accordion className="mb-4" title="注意事項" onClick={lazyLoadTerms}>
            { terms ? parse(terms) : <Loading space="both" isCentered /> }
          </Accordion>
          <FEIBButton onClick={() => history.push('/R00400', { accountNo: 'todo accountNo' })}>繳費</FEIBButton>
        </PageWrapper>
      </Main>
    </Layout>
  );
};

export default C007001;
