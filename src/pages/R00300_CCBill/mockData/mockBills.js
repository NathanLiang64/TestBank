export default function mockBills(accounts = false) {
  return {
    month: 6,
    amount: 12_200,
    minAmount: 1_000,
    billDate: '20220620',
    accountNo: '11122233334444',
    currency: 'NTD',
    autoDeduct: false,
    accounts: accounts && [
      {
        accountNo: '11122233334444',
        balance: 10_000,
      },
    ],
  };
}
