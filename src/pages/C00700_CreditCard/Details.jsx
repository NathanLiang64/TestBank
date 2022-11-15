import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import parse from 'html-react-parser';
import uuid from 'react-uuid';
import { startFunc } from 'utilities/AppScriptProxy';
import { FuncID } from 'utilities/FuncID';

import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { FEIBButton } from 'components/elements';
import Main from 'components/Layout';
import Layout from 'components/Layout/Layout';
import InformationList from 'components/InformationList';
import Accordion from 'components/Accordion';
import Loading from 'components/Loading';
import CreditCard from 'components/CreditCard';

import { currencySymbolGenerator, dateFormatter, stringToDate } from 'utilities/Generator';

import { getCreditCardDetails, getCreditCardTerms } from './api';
import PageWrapper from './Details.style';

/**
 * C007001 信用卡 資訊
 */
const Page = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [details, setDetails] = useState();
  const [terms, setTerms] = useState();

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    let accountNo;
    if (location.state && ('accountNo' in location.state)) accountNo = location.state.accountNo;
    const response = await getCreditCardDetails({ accountNo });
    setDetails(response);
    dispatch(setWaittingVisible(false));
  }, []);

  const lazyLoadTerms = async () => {
    if (!terms) setTerms(await getCreditCardTerms());
  };

  const getCardListing = (d) => ([
    { title: '帳單結帳日', content: dateFormatter(stringToDate(d.invoiceDate)) },
    { title: '繳費截止日', content: dateFormatter(stringToDate(d.billDate)) },
    { title: '本期應繳金額', content: currencySymbolGenerator(d.currency ?? 'TWD', d.amount) },
    { title: '最低應繳金額', content: currencySymbolGenerator(d.currency ?? 'TWD', d.minAmount) },
    { title: '本期累積已繳金額', content: currencySymbolGenerator(d.currency ?? 'TWD', d.accumulatedPaid) },
    { title: '最近繳費日', content: dateFormatter(stringToDate(d.recentPayDate)) },
  ]);

  const getCreditListing = (d) => ([
    { title: '你的信用卡額度', content: currencySymbolGenerator(d.currency ?? 'TWD', d.credit) },
    { title: '已使用額度', content: currencySymbolGenerator(d.currency ?? 'TWD', d.creditUsed) },
    { title: '可使用額度', content: currencySymbolGenerator(d.currency ?? 'TWD', d.creditAvailable) },
    { title: '國內預借現金可使用額度', content: currencySymbolGenerator(d.currency ?? 'TWD', d.localCashCredit) },
    { title: '國外預借現金可使用額度', content: currencySymbolGenerator(d.currency ?? 'TWD', d.foreignCashCredit) },
  ]);

  return (
    <Layout title="信用卡資訊" goBackFunc={() => history.goBack()}>
      <Main>
        <PageWrapper>
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
            { details && getCardListing(details).map((d) => (
              <InformationList key={uuid()} {...d} />
            ))}
            <hr />
          </div>
          <div className="heading">額度資訊</div>
          <div>
            { details && getCreditListing(details).map((d) => (
              <InformationList key={uuid()} {...d} />
            ))}
            <hr />
          </div>
          <Accordion className="mb-4" title="注意事項" onClick={lazyLoadTerms}>
            { terms ? parse(terms) : <Loading space="both" isCentered /> }
          </Accordion>
          <FEIBButton onClick={() => startFunc(FuncID.R00400, { accountNo: details.accountNo })}>繳費</FEIBButton>
        </PageWrapper>
      </Main>
    </Layout>
  );
};

export default Page;
