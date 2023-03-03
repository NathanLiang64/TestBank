import { callAPI } from 'utilities/axios';

/**
 * 確認是否可再新增帳本
 * @returns {Promise<{
 *   addLedger: 表示可以建立新帳本 // TODO 改用 getLedgerList 的 ledger[] 數量小於8來判斷
 *   addAccount: 表示可以建立新子帳號 // TODO 改用 2.0 的 getAccounts('C') 的數量檢查是否小於8
 * }>}
 */
export const checkAdd = async () => {
  const response = await callAPI('/ledger/checkAdd');
  return response.data;
};

/**
 * 取得建立帳本時所需的資訊。
 * @returns {Promise<{
 *   account: [{...}] 可建立帳本的帳號清單 // TODO 改用 2.0 的 getAccounts('C') 中，沒有用在帳本或存錢計劃的子帳號
 *   terms: [{...}] 使用條款清單
 *   isadd: 加開子帳號權限 // TODO 改用 2.0 的 getAccounts('C') 的數量檢查是否小於8
 * }>}
 */
export const accountList = async () => {
  const response = await callAPI('/ledger/accountList');
  return response.data;
};
