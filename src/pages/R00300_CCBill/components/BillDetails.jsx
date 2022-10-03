/* eslint-disable no-unused-vars */
import { useState } from 'react';
import uuid from 'react-uuid';

import InformationList from 'components/InformationList';
import Accordion from 'components/Accordion';
import Loading from 'components/Loading';
import {
  accountFormatter, dateFormatter, stringToDate, currencySymbolGenerator,
} from 'utilities/Generator';

import { getThisMonth } from 'utilities/MonthGenerator';
import { getBillDetails } from '../api';

const BillDetails = () => {
  const [details, setDetails] = useState();

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
    // if (!details) setDetails(await getBillDetails(getThisMonth())); // TODO: 抓系統時間（YYYYMM）作為此處參數傳入
    if (!details) setDetails(await getBillDetails('202207')); // 測試時使用202207
  };

  return (
    <Accordion title="更多帳單資訊" onClick={lazyLoadDetails}>
      { details ? getBillDetailList(details).map((d) => (
        <InformationList key={uuid()} {...d} />
      )) : <Loading space="both" isCentered /> }
    </Accordion>
  );
};

export default BillDetails;
