import { getCallerFunc } from 'utilities/AppScriptProxy';
import { callAPI } from 'utilities/axios';

/**
 * 建立台幣轉帳交易，需再完成交易確認才會真的執行轉帳。
 * @param {{
 *   transOut: '轉出帳號',
 *   transIn: {
 *     bank: '轉入帳戶的銀行',
 *     account: '轉入帳戶的帳號',
 *   },
 *   amount: '轉出金額',
 *   booking: {
 *     mode: '立即或預約。 0.立即轉帳, 1.預約轉帳',
 *     multiTimes: '單次或多次。 單次, *.多次',
 *     transDate: '轉帳日期。 multiTimes="1"時',
 *     transRange: '轉帳日期區間。 multiTimes="*"時',
 *     cycleMode: '交易頻率。 1.每周, 2.每月',
 *     cycleTiming: '交易週期。〔 0-6: 周日-周六 〕或〔 1-31: 每月1-31〕',
 *   },
 *   memo: '備註',
 * }} request
 * @returns {Promise<{
 *   result: '表示是否成功建立台幣轉帳交易記錄',
 *   message: '紀錄無法成功建立的原因',
 *   isAgreedTxn: '表示約定轉帳的旗標',
 * }>}
 */
export const createNtdTransfer = async (request) => {
  const response = await callAPI('/api/transfer/ntd/v1/create', {
    ...request,
    callerFunc: getCallerFunc(), // 啟用轉帳功能的 FuncCode, 例: 從台幣首頁叫轉帳時，應傳入C00300
  });
  return response.data;
};

/**
 * 執行轉帳交易。
 * @returns {Promise<{
 *    isSuccess,
 *    balance: 轉出後餘額,
 *    fee: 手續費,
 *    fiscCode: '財金序號 跨轉才有',
 *    maxWithdraw: 最高可提領額,
 *    accountName: 戶名,
 *    errorCode,
 *    message: 錯誤訊息,
 * }>} 轉帳結果。
 */
export const executeNtdTransfer = async () => {
  const response = await callAPI('/api/transfer/ntd/v1/execute');
  return {
    ...response.data,
    isSuccess: (response.isSuccess && !response.data.errorCode),
  };
};
