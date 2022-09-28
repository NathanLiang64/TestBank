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

import { getCreditCardDetails, getCreditCardTerms } from './api';
import PageWrapper from './Details.style';
import { getCardListing, getCreditListing } from './utils';

/**
 * C00700_1 信用卡 資訊
 */
const C007001 = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [details, setDetails] = useState();
  const [terms, setTerms] = useState();

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    let accountNo;
    if (location.state && ('accountNo' in location.state)) accountNo = location.state.accountNo;
    // TODO API
    const detailResponse = await getCreditCardDetails({ accountNo });
    console.log('detailResponse', detailResponse);
    setDetails(detailResponse);
    dispatch(setWaittingVisible(false));
  }, []);

  // TODO API
  const lazyLoadTerms = async () => {
    if (!terms) setTerms(await getCreditCardTerms());
  };

  return (
    <Layout title="信用卡資訊" goBackFunc={() => history.goBack()}>
      <Main>
        <PageWrapper>
          {!!details && (
          <>
            <div>
              <div>
                <CreditCard
                  cardName={details?.type === 'bankee' ? 'Bankee信用卡' : '所有信用卡'}
                  accountNo={details?.accountNo}
                  color="green"
                  annotation="已使用額度"
                  balance={details?.creditUsed}
                />
              </div>
            </div>
            <div>
              {getCardListing(details).map((d) => <InformationList key={uuid()} {...d} />)}
              <hr />
            </div>
            <div className="heading">額度資訊</div>
            <div>
              {getCreditListing(details).map((d) => <InformationList key={uuid()} {...d} />)}
              <hr />
            </div>
          </>
          )}

          <Accordion className="mb-4" title="注意事項" onClick={lazyLoadTerms}>
            { terms ? parse(terms) : <Loading space="both" isCentered /> }
          </Accordion>
          <FEIBButton onClick={() => history.push('/R00400', { accountNo: details.accountNo })}>繳費</FEIBButton>
        </PageWrapper>
      </Main>
    </Layout>
  );
};

export default C007001;
