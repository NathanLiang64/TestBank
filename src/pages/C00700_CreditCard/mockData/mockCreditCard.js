const genTransactions = () => {
  const temp = [];
  for (let i = 0; i < 10; i++) {
    temp.push({
      index: i + 1,
      bizDate: (20220425 + i).toString(),
      txnDate: (20220425 + i).toString(),
      txnTime: 210156,
      description: '全家便利商店',
      memo: '最多七個字',
      targetMbrId: null,
      targetNickName: null,
      targetBank: '000',
      targetAcct: null,
      amount: 1_000 * i,
      balance: 386_000 - (1_000 * i),
      cdType: 'cc',
      currency: 'TWD',
    });
  }
  return temp;
};

export default [
  {
    type: 'bankee',
    accountNo: '11122233334444',
    expenditure: 10000000,
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
    expenditure: 20000000,
    autoDeduct: false,
    transactions: genTransactions(),
  },
];
