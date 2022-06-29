export default function mockCreditCardDetails(param) {
  let type = 'bankee';
  if ('accountNo' in param) {
    type = param.accountNo;
  }

  return {
    type,
    accountNo: '11122233334444',
    currency: 'TWD',
    invoiceDate: '20220620',
    billDate: '20220719',
    amount: 12_200,
    minAmount: 1_000,
    accumulatedPaid: 0,
    recentPayDate: '20220525',
    credit: 35_000,
    creditUsed: 12_200,
    creditAvailable: 22_800,
    localCashCredit: 50_000,
    foreignCashCredit: 30_000,
  };
}
