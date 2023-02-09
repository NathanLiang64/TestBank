// import { useState } from 'react';
import uuid from 'react-uuid';

import InformationList from 'components/InformationList';
import Accordion from 'components/Accordion';
import Loading from 'components/Loading';
import {
  accountFormatter, dateToString, currencySymbolGenerator,
} from 'utilities/Generator';

const BillDetails = ({bills}) => {
  const getBillDetailList = (d) => [
    {
      title: '本期應繳金額',
      content: currencySymbolGenerator(d.currency ?? 'NTD', d.newBalance),
    },
    {
      title: '最低應繳金額',
      content: currencySymbolGenerator(d.currency ?? 'NTD', d.minDueAmount),
    },
    {
      title: '帳單結帳日',
      content: dateToString(d.billClosingDate),
    },
    {
      title: '繳費截止日',
      content: dateToString(d.payDueDate),
    },
    {
      title: '上期應繳金額',
      content: currencySymbolGenerator(d.currency ?? 'NTD', d.prevBalance),
    },
    {
      title: '已繳/退金額',
      content: currencySymbolGenerator(d.currency ?? 'NTD', d.paidRefundAmount),
    },
    {
      title: '本期新增款項',
      content: currencySymbolGenerator(d.currency ?? 'NTD', d.newPurchaseAmount),
    },
    {
      title: '利息',
      content: currencySymbolGenerator(d.currency ?? 'NTD', d.interestFee),
    },
    {
      title: '違約金',
      content: currencySymbolGenerator(d.currency ?? 'NTD', d.cardPenalty),
    },
    {
      title: '循環信用額度',
      content: currencySymbolGenerator(d.currency ?? 'NTD', d.revCreditLimit),
    },
    {
      title: '循環信用本金餘額',
      content: currencySymbolGenerator(d.currency ?? 'NTD', d.revgCreditPrinBalance),
    },
    {
      title: '自動扣款帳號',
      // TODO 待確認自動扣款帳號的 bankId 名稱
      content: accountFormatter(d.autoPayAccount),
    },
    {
      title: '繳款截止日扣款金額',
      content: currencySymbolGenerator(d.currency ?? 'NTD', d.paidAmountOnDueDate),
    },
  ];

  return (
    <Accordion title="更多帳單資訊" onClick={bills}>
      { bills ? getBillDetailList(bills).map((d) => (
        <InformationList key={uuid()} {...d} />
      )) : <Loading space="both" isCentered /> }
    </Accordion>
  );
};

export default BillDetails;
