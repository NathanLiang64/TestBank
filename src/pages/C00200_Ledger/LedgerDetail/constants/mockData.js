import uuid from 'react-uuid';

// 可用於 DetailCard 元件測試
export const addDetailCard = (number = 10) => Array.from(Array(number), (item, id) => ({
  id: uuid(),
  amount: Math.floor(Math.random() * 1000),
  balance: Math.floor(Math.random() * 60000),
  description: `測試標題${id}`,
  txnDate: new Date(),
  cdType: Math.random() > 0.5 ? 'd' : 'c',
  memo: `備註${id}`,
}));

export const MAIN_CARD_CONFIG = {
  name: '帳本名稱',
  balance: 6000,
};

// 可用於 AccordionDetails 元件之 selectedAccount 測試
export const TRANSACTIONS_LIST = {
  startIndex: 1,
  dataDirect: 0,
  minIndex: 1,
  maxIndex: 50,
  monthly: ['202303', '202302', '202301'],
  acctTxDtls: Array.from(Array(50), () => ({
    index: uuid(),
    bizDate: '20230302',
    txnDate: '20230302',
    txnTime: '91315',
    description: '網路連動轉出',
    memo: '',
    targetMbrId: null,
    targetNickName: null,
    targetBank: '000',
    targetAcct: '04300497000938',
    amount: 6,
    balance: Math.random() * 60000,
    cdType: Math.random() > 0.5 ? 'd' : 'c',
    currency: 'NTD',
    invert: false,
  })),
};
