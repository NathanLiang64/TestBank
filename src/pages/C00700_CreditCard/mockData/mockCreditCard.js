import uuid from 'react-uuid';

const genTransactions = () => Array.from(Array(10)).map((_, i) => ({
  id: uuid(),
  ccNo: '1112223333444455',
  index: i + 1,
  bizDate: (20220425 + i).toString(),
  txnDate: (20220425 + i).toString(),
  txnTime: 210156,
  description: '全家便利商店',
  memo: '',
  targetMbrId: null,
  targetNickName: null,
  targetBank: '000',
  targetAcct: null,
  amount: 1_000 * i,
  balance: 386_000 - (1_000 * i),
  cdType: 'cc',
  currency: 'TWD',
}));

export default [
  {
    type: 'bankee',
    accountNo: '11122233334444',
    creditUsed: 10000000,
    autoDeduct: true,
    bonusInfo: {
      level: 4,
      rewardLocalRate: 1.2,
      rewardForeignRate: 3,
      rewards: 39,
    },
    transactions: genTransactions(),
  },
  {
    type: 'all',
    accountNo: '11122233334444',
    creditUsed: 20000000,
    autoDeduct: false,
    transactions: genTransactions(),
  },
];
