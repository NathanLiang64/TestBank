/**
 * 取得帳本明細列表 (參考開發文件v3 -> p108)
 * 舊版本API名稱: ledgerTxList
 * 新版本API名稱: getLedgerTxn
 */
export const getLedgerTxn = () => new Promise((resolve) => {
  const pendingTime = 1e3;
  const data = {
    txnList: [
      {
        txDate: '2021-02-19', // 交易時間
        bankeeMember: {
          memberNickName: 'Little', // 暱稱
        },
        bankAccount: '0004300499099463', // 交易帳號
        txDesc: 'hihi', // 交易敘述
        txType: '1', // 交易類型
        ledgerTxId: '811', // 交易 id
        txCurrency: 'NTD', // 交易貨幣
        countAmount: '2', // 帳本餘額
        txnAmount: -2, // 交易金額
      },
      {
        txDate: '2021-02-17',
        bankeeMember: {
          memberNickName: '十月二一測試四',
        },
        bankAccount: '0004300499099455',
        txDesc: 'Hihi',
        txType: '1',
        ledgerTxId: '810',
        txCurrency: 'NTD',
        countAmount: '4',
        txnAmount: -2,
      },
    ],
  };
  setTimeout(() => {
    resolve(data);
  }, pendingTime);
});
