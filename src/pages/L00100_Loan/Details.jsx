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
    let account;
    let subNo;
    if (location.state && ('account' in location.state) && ('subNo' in location.state)) {
      account = location.state.account;
      subNo = location.state.subNo;
      setParam({account, subNo});
    }
    const response = await getInfo({account, subNo});
    // const response = await getLoanDetails({ accountNo: actno });
    setDetails(response);
    dispatch(setWaittingVisible(false));
  }, []);

  const getListing = (d) => ([
    { title: '貸款帳號', content: accountFormatter(param.account) },
    { title: '貸款分號', content: param.subNo },
    // { title: '貸款類別', content: d.loanType }, TODO: 主機未有資料，暫隱藏
    { title: '貸款期限', content: `${dateToString(d.startDate)}~${dateToString(d.endDate)}` },
    { title: '每期還款日', content: `每月${d.dayToPay}日` },
    { title: '初貸金額', content: currencySymbolGenerator(d.currency ?? 'NTD', d.txAmt) },
    { title: '貸款利率', content: `${d.rate}%` },
    { title: '貸款餘額', content: currencySymbolGenerator(d.currency ?? 'NTD', d.loanBalance) },
    { title: '已繳期數', content: `${d.periodPaid}期` },
    { title: '剩餘期數', content: `${d.periodRemaining}期` },
  ]);

  return (
    <Layout title="貸款資訊" goBackFunc={() => history.goBack()}>
      <Main small>
        <PageWrapper>
          <AccountCard type="L">
            <div>{details?.type}</div>
            <div>{`${param?.account} (${param?.subNo})`}</div>
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
