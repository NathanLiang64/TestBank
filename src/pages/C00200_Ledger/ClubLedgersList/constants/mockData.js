/**
 * 取得用戶帳本清單 (參考開發文件v3 -> p82)
 * 舊版本API名稱: ledgerList
 * 新版本API名稱: getAllLedgersRs
 */
export const getAllLedgers = () => new Promise((resolve) => {
  const pendingTime = 300;
  const data = {
    ledger: [
      {
        ledgerAmount: '10,000', // 帳本餘額
        ledgerColor: 7, // 帳本顏色
        isOwner: true, // 是否為主揪
        sumOfMembers: 10, // 成員人數
        ledgerId: '001', // 帳本 ID
        ledgerName: '春季旅遊', // 帳本名稱
      },
      {
        ledgerAmount: '15,000', // 帳本餘額
        ledgerColor: 2, // 帳本顏色
        isOwner: false, // 是否為主揪
        sumOfMembers: 15, // 成員人數
        ledgerId: '002', // 帳本 ID
        ledgerName: '秋季旅遊', // 帳本名稱
      },
    ],
  };
  const resData = Math.random() > 0 ? data : [];
  setTimeout(() => {
    resolve(resData);
  }, pendingTime);
});
