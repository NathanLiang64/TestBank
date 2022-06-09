import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import parse from 'html-react-parser';

import {
  DownloadIcon, TransactionIcon, CalendarIcon,
} from 'assets/images/icons';
import Layout from 'components/Layout/Layout';
import Main from 'components/Layout';
import BottomAction from 'components/BottomAction';
import InformationList from 'components/InformationList';
import InformationTape from 'components/InformationTape';
import Badge from 'components/Badge';
import Accordion from 'components/Accordion';
import Loading from 'components/Loading';
import { setWaittingVisible, setDrawer, setDrawerVisible } from 'stores/reducers/ModalReducer';
import {
  accountFormatter, dateFormatter, stringToDate, currencySymbolGenerator,
} from 'utilities/Generator';
import {
  FEIBTabContext,
  FEIBTabList,
  FEIBTab,
} from 'components/elements';

import {
  getBills,
  getBillDetails,
  getInvoice,
  getCreditCardTerms,
} from './api';
import PageWrapper, { DownloadDrawerWrapper } from './R00300.style';

/**
 * C00700 信用卡 帳單頁
 */
const Page = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [bills, setBills] = useState();
  const [details, setDetails] = useState();
  const [terms, setTerms] = useState();

  const thisMonth = () => {
    const tmp = new Date().toLocaleDateString(undefined, { year: 'numeric', month: '2-digit' }).split('/');
    return `${tmp[1]}${tmp[0]}`;
  };
  const [selectedMonth, setSelectedMonth] = useState(thisMonth());

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    const response = await getBills();
    setBills(response);
    dispatch(setWaittingVisible(false));
  }, []);

  const getBillDetailList = (d) => [
    {
      title: '本期應繳金額',
      content: currencySymbolGenerator(d.currency ?? 'NTD', d.amount),
    },
    {
      title: '最低應繳金額',
      content: currencySymbolGenerator(d.currency ?? 'NTD', d.minAmount),
    },
    {
      title: '帳單結帳日',
      content: dateFormatter(stringToDate(d.invoiceDate)),
    },
    {
      title: '繳費截止日',
      content: dateFormatter(stringToDate(d.billDate)),
    },
    {
      title: '上期應繳金額',
      content: currencySymbolGenerator(d.currency ?? 'NTD', d.prevAmount),
    },
    {
      title: '已繳/退金額',
      content: currencySymbolGenerator(d.currency ?? 'NTD', d.prevDeductedAmount),
    },
    {
      title: '本期新增款項',
      content: currencySymbolGenerator(d.currency ?? 'NTD', d.newAmount),
    },
    {
      title: '利息',
      content: currencySymbolGenerator(d.currency ?? 'NTD', d.rate),
    },
    {
      title: '違約金',
      content: currencySymbolGenerator(d.currency ?? 'NTD', d.fine),
    },
    {
      title: '循環信用額度',
      content: currencySymbolGenerator(d.currency ?? 'NTD', d.credit),
    },
    {
      title: '循環信用本金餘額',
      content: currencySymbolGenerator(d.currency ?? 'NTD', d.creditAvailable),
    },
    {
      title: '自動扣款帳號',
      content: accountFormatter(d.bindAccountNo),
    },
    {
      title: '繳款截止日扣款金額',
      content: currencySymbolGenerator(d.currency ?? 'NTD', d.deductAmount),
    },
  ];

  const lazyLoadDetails = async () => {
    if (!details) setDetails(await getBillDetails());
  };

  const lazyLoadTerms = async () => {
    if (!terms) setTerms(await getCreditCardTerms());
  };

  const renderReminderText = () => {
    const due = stringToDate(bills.billDate);
    const today = new Date();
    const dueDateString = `每月${due.getDate()}日`;
    const deltaDays = Math.ceil(Math.abs(due - today) / (1000 * 60 * 60 * 24));

    // 逾截止日
    if (today > due) return bills.autoDeduct ? `${dueDateString}自動扣繳` : `繳款截止日：${dueDateString}`;

    // 10天以上
    if (deltaDays >= 10) return bills.autoDeduct ? `自動扣繳（${dueDateString}）尚有${deltaDays}天` : `繳款截止日（${dueDateString}）尚有${deltaDays}天`;

    // 1-9天
    return bills.autoDeduct ? (
      <>
        {`自動扣繳（${dueDateString}）尚有${deltaDays}天`}
        <br />
        提醒您確認帳戶餘額！
      </>
    ) : (
      <>
        {`繳款截止日（${dueDateString}）尚有${deltaDays}天`}
        <br />
        提醒您於截止日前繳款
      </>
    );
  };

  const handleDownloadInvoice = () => {
    dispatch(setDrawer({
      title: '',
      content: (
        <DownloadDrawerWrapper>
          <li>
            <button type="button" onClick={() => getInvoice(1)}>
              下載 PDF
              <DownloadIcon />
            </button>
          </li>
          <li>
            <button type="button" onClick={() => getInvoice(2)}>
              下載 EXCEL
              <DownloadIcon />
            </button>
          </li>
        </DownloadDrawerWrapper>
      ),
    }));
    dispatch(setDrawerVisible(true));
  };

  const handleOnTabChange = (_, id) => {
    setSelectedMonth(id);
  };

  const getMonthList = () => {
    const list = [];
    const date = new Date();
    for (let i = 0; i < 6; i++) {
      const tmp = date.toLocaleDateString(undefined, { year: 'numeric', month: '2-digit' }).split('/');
      list.push(`${tmp[1]}${tmp[0]}`);
      date.setMonth(date.getMonth() - 1);
    }
    return list;
  };

  return (
    <Layout title="信用卡帳單" goBackFunc={() => history.goBack()}>
      <Main small>
        <PageWrapper>
          <Badge label={`${bills?.month}月應繳金額`} value={currencySymbolGenerator(bills?.currency ?? 'NTD', bills?.amount)} />
          <div className="cal">
            { bills && (
              <>
                <div className="auto">{ renderReminderText() }</div>
                <CalendarIcon />
              </>
            )}
          </div>

          <div className="badMargin">
            <FEIBTabContext value={selectedMonth}>
              <FEIBTabList onChange={handleOnTabChange}>
                { getMonthList().map((m) => <FEIBTab label={`${m.slice(4, 6)}月`} value={m} />)}
              </FEIBTabList>
            </FEIBTabContext>
          </div>

          <div>
            <InformationTape topLeft="A" topRight="B" bottomLeft="C" />
            <InformationTape topLeft="A" topRight="B" bottomLeft="C" />
            <InformationTape topLeft="A" topRight="B" bottomLeft="C" />
          </div>

          <Accordion title="更多帳單資訊" onClick={lazyLoadDetails}>
            { details ? getBillDetailList(details).map((d) => (
              <InformationList {...d} />
            )) : <Loading space="both" isCentered /> }
          </Accordion>

          <Accordion title="注意事項" onClick={lazyLoadTerms}>
            { terms ? parse(terms) : <Loading space="both" isCentered /> }
          </Accordion>

          <BottomAction>
            <button type="button" onClick={() => history.push('/R00400')}>
              <TransactionIcon />
              重新轉帳
            </button>
            <div className="divider" />
            <button type="button" onClick={handleDownloadInvoice}>
              <DownloadIcon />
              下載帳單
            </button>
          </BottomAction>

        </PageWrapper>
      </Main>
    </Layout>
  );
};

export default Page;
