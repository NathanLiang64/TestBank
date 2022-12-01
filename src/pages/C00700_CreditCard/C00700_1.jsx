/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import parse from 'html-react-parser';

import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { FEIBButton } from 'components/elements';
import Main from 'components/Layout';
import Layout from 'components/Layout/Layout';
import InformationList from 'components/InformationList';
import Accordion from 'components/Accordion';
import Loading from 'components/Loading';
import CreditCard from 'components/CreditCard';

// eslint-disable-next-line no-unused-vars
import { closeFunc, startFunc } from 'utilities/AppScriptProxy';
import { showCustomPrompt, showError } from 'utilities/MessageModal';
import { FuncID } from 'utilities/FuncID';

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
  const [cardInfo, setCardInfo] = useState();
  const [terms, setTerms] = useState();
  const dispatch = useDispatch();

  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    if (!location.state) {
      showCustomPrompt({message: '查無信用卡資訊', onOk: closeFunc, onClose: closeFunc});
    }

    const infoResponse = await queryCardInfo(location.state.isBankeeCard ? location.state.cards[0].cardNo : '');
    if (infoResponse.data) {
      setCardInfo(infoResponse.data);
    }

    dispatch(setWaittingVisible(false));
  }, []);

  const lazyLoadTerms = async () => {
    if (!terms) setTerms(await getCreditCardTerms());
  };

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
                  accountNo={location.state.cards[0].cardNo}
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
          <FEIBButton onClick={() => startFunc(FuncID.R00400, { accountNo: location.state.cards[0].cardNo })}>繳費</FEIBButton>
        </InfoPageWrapper>
      </Main>
    </Layout>
  );
};

export default C007001;
