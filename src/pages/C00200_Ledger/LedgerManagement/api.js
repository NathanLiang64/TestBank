import { callAPI } from 'utilities/axios';

/**
 * 登入帳本（一定要執行，才能使用其他帳本API）
 * @returns {Promise<{
 *   memberName, memberNickName, ... 等會員基本資料。
 * }>}
 */
export const login = async () => {
  // NOTE 目前只支援Bankee會員在登入後，進入帳本的登入。
  const response = await callAPI('/ledger/login');
  return response.data;
};

/**
 * 取得帳本中所使用的下拉清單選項。
 * @returns {Promise<{
 *   ledgerTypeList: [{ ledgerType, typeName}], // 帳本類型，例：聚餐、社團...
 *   ledgerUsageList: [{ usageType, typeName}], // 帳本用途，例：食、衣...
 *   txUsageList: [{ txType, typeName}], // 交易類型，例：食、衣...
 * }>}
 */
export const getListItems = async () => {
  const response = await callAPI('/ledger/getListItems'); // TODO 可建立Cache 保存
  return response.data;
};

/**
 * 取得我的帳本清單
 * @returns {Promise<{
 *   ledger: [{ledgerId, ledgerType, ledgerStatus, ledgerName, ...}],
 *   notice: [{ledgerId, ledgerName, applyCount, unpayCount}]
 * }>}
 */
export const getLedgerList = async () => {
  const response = await callAPI('/ledger/getLedgerList'); // TODO 可建立Cache 保存
  return response.data;
};

// 編輯帳本名稱
export const setLedgerName = async (payload) => {
  const response = await callAPI('/ledger/setLedgerName', payload);
  return response.data;
};

// 編輯暱稱
export const setNickname = async (payload) => {
  const response = await callAPI('/ledger/setNickname', payload);
  return response.data;
};

// 取得帳本成員的綁定帳號
export const getBankAccount = async () => {
  const response = await callAPI('/ledger/partner/getBankAccount');
  return response.data;
};

// 編輯帳本成員的綁定帳號
export const setBankAccount = async (payload) => {
  const response = await callAPI('/ledger/partner/setBankAccount', payload);
  return response.data;
};
