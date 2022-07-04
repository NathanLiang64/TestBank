export default function mockTransactions(param) {
  const start = +param?.startDate;
  const end = +param?.endDate;

  const list = [];
  if (start && end && start <= end) {
    for (let i = end; i >= start; i--) {
      if (Math.round(Math.random()) > 0) list.push(i);
    }
  }

  return list.map((l) => ({
    id: 1,
    index: 1,
    bizDate: l.toString(),
    txnDate: l.toString(),
    txnTime: 210156,
    description: '全家便利商店',
    memo: '備註最多7個字',
    targetMbrId: null,
    targetNickName: null,
    targetBank: '000',
    targetAcct: '1112223333444455',
    amount: Math.random() * 29_990 + 10,
    balance: 386000,
    cdType: 'cc',
    currency: 'TWD',
  }));
}
