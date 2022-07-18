import uuid from 'react-uuid';

const genTransactions = (amount = 5) => [...Array(amount).keys()].map((i) => {
  const mockMonth = new Date();
  mockMonth.setMonth(new Date().getMonth() - i);
  return {
    id: uuid(),
    txnDate: `${mockMonth.getFullYear()}${mockMonth.getMonth() < 9 ? '0' : ''}${mockMonth.getMonth() + 1}04`,
    amount: Math.round(Math.random() * 50_000) + 1_000,
    balance: Math.round(Math.random() * 50_000) + 50_000,
    currency: 'NTD',
  };
});

export default () => [
  {
    alias: '房貸',
    accountNo: '11122233334444',
    loanNo: '001',
    balance: 2_000_000,
    currency: 'NTD',
    bonusInfo: {
      cycleTiming: 15,
      interest: 10_000,
      rewards: 19,
      isJoinedRewardProgram: true,
      currency: 'NTD',
    },
    transactions: genTransactions(),
  },
  {
    alias: '車貸',
    accountNo: '44433322221111',
    balance: 1_000_000,
    currency: 'NTD',
    bonusInfo: {
      cycleTiming: 5,
      interest: 5_000,
      rewards: 0,
      isJoinedRewardProgram: false,
      currency: 'NTD',
    },
    transactions: genTransactions(),
  },
  {
    alias: '貸貸',
    accountNo: '55500066660000',
    balance: 3_000_000,
    currency: 'NTD',
    bonusInfo: {
      cycleTiming: 28,
      interest: 100_000,
      rewards: 0,
      isJoinedRewardProgram: true,
      currency: 'NTD',
    },
    transactions: genTransactions(),
  },
];
