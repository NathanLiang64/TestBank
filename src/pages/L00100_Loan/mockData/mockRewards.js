const genTransactions = (amount = 6) => [...Array(amount).keys()].map((i) => {
  const mockMonth = new Date();
  mockMonth.setMonth(new Date().getMonth() - i);
  return {
    isSuccess: Math.random() < 0.2,
    txnDate: `${mockMonth.getFullYear()}${mockMonth.getMonth() < 9 ? '0' : ''}${mockMonth.getMonth() + 1}01`,
    amount: Math.round(Math.random() * 50_000) + 1_000,
    rate: 2.6,
    currency: 'NTD',
  };
});

export default ({ accountNo = '11122233334444', month = 6 }) => {
  switch (accountNo) {
    case '44433322221111':
      return {
        isJoinedRewardProgram: false,
      };
    case '11122233334444':
      return {
        rewards: 19,
        isJoinedRewardProgram: true,
        currency: 'NTD',
        transactions: genTransactions(month),
      };
    default:
      return {
        rewards: 0,
        isJoinedRewardProgram: true,
        currency: 'NTD',
        transactions: [],
      };
  }
};
