import { callAPI } from 'utilities/axios';

/**
 * 取得帳號基本資料，不含跨轉優惠次數，且餘額「非即時」。
 * @return [{
 *   accountNo: 帳號,
 *   branchId: 分行代碼,
 *   balance: 帳戶餘額(, // NOTE 餘額「非即時」資訊
 *   alias: 帳戶名稱，若有暱稱則會優先用暱稱,
 *   dgType: 帳戶類別('  '.非數存帳號, '11'.臨櫃數存昇級一般, '12'.一之二類, ' 2'.二類, '32'.三之二類)
 *   transable: 已設約轉 或 同ID互轉(true/false)
 * }, ...]
 */
export const getAccountsList = async () => {
  // API /api/deposit/v1/getAccounts Response [{
  //   account: 帳號,
  //   name: 帳戶名稱，若有暱稱則會優先用暱稱,
  //   dgType: 帳戶類別('  '.非數存帳號, '11'.臨櫃數存昇級一般, '12'.一之二類, ' 2'.二類, '32'.三之二類)
  //   transable: 已設約轉 或 同ID互轉(true/false)
  //   details: [{ // 外幣多幣別時有多筆
  //        balance: 帳戶餘額(, // NOTE 餘額「非即時」資訊
  //        currency: 幣別代碼,
  //   }, ...]
  // }, ...]
  const acctTypes = 'MSC'; // 帳戶類型 M:母帳戶, S:證券戶, F:外幣帳戶, C:子帳戶
  const response = await callAPI('/api/deposit/v1/getAccounts', acctTypes);
  return response.data.map((acct) => ({
    accountNo: acct.account,
    branchId: acct.account.substring(0, 3),
    balance: acct.details[0].balance,
    alias: acct.name,
    dgType: acct.dgType,
    transable: acct.transable,
  }));
};

/**
 * 取得取得免費跨提/跨轉次數、數存優惠利率及資訊
 * @param {*} accountNo 存款帳號
 * @returns 優惠資訊
  {
    freeWithdraw: 6, // 免費跨提 總次數
    freeWithdrawRemain: 6, // 免費跨提 剩餘次數
    freeTransfer: 6, // 免費跨轉 總次數
    freeTransferRemain: 6, // 免費跨轉 剩餘次數
    bonusQuota: 50000, // 優惠利率額度
    bonusRate: 0.081, // 優惠利率
    interest: 1999, // 累積利息
  }
 */
export const getAccountExtraInfo = async (accountNo) => {
  const response = await callAPI('/api/depositPlus/v1/getBonusInfo', accountNo);
  return response.data;
};

/**
 * 查詢轉出帳號清單。
 * @returns [{
 *   acctType: 帳戶類型(M:母帳戶, S:證券戶, F:外幣帳戶, C:子帳戶),
 *   bankId: 銀行代碼,
 *   accountId: 帳號
 *   mainFlag: 主要帳戶，依據帳戶類型會標記一個主要帳戶
 *   balance: 帳戶餘額,
 *   ccyCd: 幣別代碼,
 *   isBooking: 是否有設約定帳號,
 *   tfrhCount: 提款優惠總次數,
 *   cwdhCount: 提款優惠剩餘次數,
 *   singleLimit: 交易金額額度,
 *   alias: 帳戶暱稱,
 *   showName: 顯示名稱，會帶帳戶的預設命名，有暱稱則會優先用暱稱,
 *   bindType: 綁定類別(1.社群帳本、2.存錢計畫)
 *
 *   branchId: 分行代碼 = 取 accountId 0~2碼,
 *   accountType: 帳號類別 = 取 accountId 3~5碼,
 *   isTwd: 是否為台幣 = acctType=M/S/C,
 *   ccyName: 幣別名稱,
 *   isManyCcy: 是否為多幣別帳號 acctType=F,
 * }, ...]
 */
export const getAccounts = async () => {
  const response = await callAPI('/api/transfer/queryNtdTrAcct');
  return response.data.accounts;
};
