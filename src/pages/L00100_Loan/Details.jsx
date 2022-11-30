/* eslint react/no-array-index-key: 0 */

import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import uuid from 'react-uuid';

import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import Main from 'components/Layout';
import Layout from 'components/Layout/Layout';
import AccountCard from 'components/AccountCard';
import InformationList from 'components/InformationList';
import {
  accountFormatter, dateToString, currencySymbolGenerator,
} from 'utilities/Generator';

import { getInfo } from './api';
import PageWrapper from './Details.style';

const uid = uuid();

/**
 * L00100 貸款 資訊頁
 */
const Page = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [param, setParam] = useState({});
  const [details, setDetails] = useState();

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    let actno;
    let sqno;
    if (location.state && ('actno' in location.state) && ('sqno' in location.state)) {
      actno = location.state.actno;
      sqno = location.state.sqno;
      setParam({actno, sqno});
    }
    const response = await getInfo({actno, sqno});
    // const response = await getLoanDetails({ accountNo: actno });
    setDetails(response);
    dispatch(setWaittingVisible(false));
  }, []);

  const getListing = (d) => ([
    { title: '貸款帳號', content: accountFormatter(d.actno) },
    { title: '貸款分號', content: d.loanNo },
    // { title: '貸款類別', content: d.loanType },
    { title: '貸款期限', content: `${dateToString(d.startDate)}~${dateToString(d.dueDate)}` },
    { title: '每期還款日', content: `每月${d.dateToPay}日` },
    { title: '貸款金額', content: currencySymbolGenerator(d.currency ?? 'TWD', d.txAmt) },
    { title: '貸款利率', content: `${d.rate}%` },
    { title: '貸款餘額', content: currencySymbolGenerator(d.currency ?? 'TWD', d.loanBalance) },
    { title: '已繳期數', content: `${d.periodPaid}期` },
    { title: '剩餘期數', content: `${d.periodRemaining}期` },
  ]);

  return (
    <Layout title="貸款資訊" goBackFunc={() => history.goBack()}>
      <Main small>
        <PageWrapper>
          <AccountCard type="L">
            {/* TODO: 貸款別名 */}
            <div>{details?.type}</div>
            <div>{`${param?.actno} (${param?.sqno})`}</div>
            <div className="justify-between items-center gap-4">
              <div className="text-14">貸款餘額</div>
              <div className="balance">
                {`${currencySymbolGenerator(details?.currency ?? 'NTD', details?.txAmt ?? 0)}`}
              </div>
            </div>
          </AccountCard>
          <div>
            { details && getListing(details).map((d, i) => (
              <InformationList key={`${uid}-${i}`} {...d} />
            ))}
            <hr />
          </div>
          <p className="remark">提早結清：12個月內結清，收取3%提前還款手續費；超過第12個月起提前還款收取0%手續費。</p>
        </PageWrapper>
      </Main>
    </Layout>
  );
};

export default Page;
