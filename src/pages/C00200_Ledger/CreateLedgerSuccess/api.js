import { callAPI } from 'utilities/axios';

/**
 * 開啟指定帳本，並傳回帳本詳細資料。
 * 註：一定要執行，才能使用其他帳本操作或查詢的API
 * @param {Number} ledgerId 帳本識別碼, 是從 /ledger/initList API 取得。
 * @return {ledgerId, ledgerType, ledgerStatus, ledgerName, ...}
 */
export const openLedger = async (payload) => {
  const response = await callAPI('/ledger/openLedger', payload);
  return response.data;
};
