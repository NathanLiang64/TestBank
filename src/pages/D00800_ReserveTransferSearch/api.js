import { callAPI } from 'utilities/axios';

// 取得轉出帳號
export const getTransferOutAccounts = async (param) => {
  const response = await callAPI('/api/transfer/queryNtdTrAcct', param);
  return response;
};

// 查詢預約轉帳明細
export const getReservedTransDetails = async (param) => {
  const response = await callAPI('/api/transfer/reserved/transDetails', param);
  return response;
};

// 查詢預約轉帳結果明細
export const getResultTransDetails = async (param) => {
  const response = await callAPI('/api/transfer/reserved/resultDetails', param);
  return response;
};

// 取消預約轉帳交易
export const cancelReserveTransfer = async (param) => {
  const response = callAPI('/api/transfer/reserved/cancel', param);
  return response;
};
