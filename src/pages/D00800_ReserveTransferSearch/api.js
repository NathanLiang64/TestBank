import { callAPI } from 'utilities/axios';

// 取得轉出帳號 ***棄用***
// export const getTransferOutAccounts = async (param) => {
//   const response = await callAPI('/api/transfer/queryNtdTrAcct', param);
//   return response;
// };

/**
 * 查詢客戶信用卡帳單資訊
 * (信用卡子首頁_信用卡資訊)
 * @param {
 *    accountNo: 帳號
 *    startDay: 查詢起始日 YYYYMMDD
 *    endDay: 查詢截止日 YYYYMMDD
 * }
 */
// 查詢預約轉帳明細
export const getReservedTransDetails = async (param) => {
  const response = await callAPI('/api/transfer/reserved/transDetails', param);
  return response.data;
};

// 查詢預約轉帳結果明細
export const getResultTransDetails = async (param) => {
  const response = await callAPI('/api/transfer/reserved/resultDetails', param);
  return response.data;
};

// 取消預約轉帳交易
export const cancelReserveTransfer = async (param) => {
  const response = callAPI('/api/transfer/reserved/cancel', param);
  return response;
};

/**
 * 取得存款帳戶卡片所需的資訊
 * @param {*} acctType 帳戶類型 M:母帳戶, S:證券戶, F:外幣帳戶, C:子帳戶
 * @returns 存款帳戶資訊。
 */
export const getAccountSummary = async (acctTypes) => {
  const response = await callAPI('/api/deposit/v1/getAccountSummary', acctTypes);
  return response.data.map((acct) => ({
    acctBranch: acct.branch, // 分行代碼
    acctName: acct.name, // 帳戶名稱或暱稱
    acctId: acct.account, // 帳號
    accountType: acct.type, // 帳號類別
    acctBalx: acct.balance, // 帳戶餘額
    ccycd: acct.currency, // 幣別代碼
  }));
};
