/* eslint-disable no-unused-vars */
import { callAPI } from 'utilities/axios';
import { mockLedgerTxRt, mockWriteOffListRt } from './mockData';

/**
 * 取得單一帳本明細
 * @param {{
 * sync: boolean
 * }} param
 * @returns {{
 * txDate: string
 * txAmount: number
 * txUsageName: string
 * bankCode: string
 * bankAccount: string
 * txDesc: string
 * memberNickName: string
 * isEditable: boolean
 * txStatus: number
 * isOwner: boolean
 * }}
 */
export const getLedgerTx = (param) => {
  /* 取得帳本所有明細 */
  // const response = callAPI('/ledger/getLedgerTx', {sync: false});
  console.log('getLedgerTx', {param}); // {sync: boolean}
  const response = {
    code: '0000',
    data: mockLedgerTxRt,
  };

  /* 依明細id取得帳本單一明細 */
  const resSingleTx = response.data.txnList.find((txn) => txn.ledgerTxId === param.ledgerTxId);

  return {
    ledgerTxId: resSingleTx.ledgerTxId,
    txDate: resSingleTx.txDate,
    memberNickName: resSingleTx.bankeeMember.memberNickName,
    txAmount: resSingleTx.txAmount,
    txUsageName: resSingleTx.txUsageName,
    bankCode: resSingleTx.bankCode,
    bankAccount: resSingleTx.bankAccount,
    txDesc: resSingleTx.txDesc,
    isEditable: resSingleTx.editable,
    txStatus: resSingleTx.txStatus,
    isOwner: resSingleTx.owner,
    type: resSingleTx.type,
  };
};

/**
 * 編輯帳本明細 (已入帳) *NOTE: API未看到
 * @param {{
 * txid: string
 * type: string
 * desc: string
 * }} param
 */
export const ledgerTxEdit = (param) => {
  console.log('ledgerTxEdit', {param});
};

/**
 * 取得目前帳本可銷帳的帳本交易明細清單 (銷帳對象array)
 * @param {{
 * type: number
 * amount: number
 * }} param
 * @returns {{
 * isWriteOffList: boolean
 * ledgertx: [
 * ledgerTxId: string
 * txType: string
 * txUsage: string
 * txDate: string
 * txCurrency: string
 * txAmount: string
 * txDesc: string
 * sourceMember: string
 * ]
 * }}
 */
export const getWriteOffList = (param) => {
  // const response = callAPI('/ledger/getLedgerTx', param);
  console.log('/getWriteOffList', {param});
  const response = {
    code: '0000',
    data: mockWriteOffListRt,
  };

  const tempLedgerTxList = response.data.ledgertx.map((tx) => ({
    ledgerTxId: tx.ledgerTxId,
    txType: tx.txType,
    txUsage: tx.txUsage,
    txDate: tx.txDate,
    txCurrency: tx.txCurrency,
    txAmount: tx.txAmount,
    txDesc: tx.txDesc,
    sourceMember: tx.bankeeMember.memberNickName,
  }));

  return {
    isWriteOffList: tempLedgerTxList.length !== 0,
    ledgertx: tempLedgerTxList,
  };
};

/**
 * 未入帳銷帳作業 *NOTE: API rq, rs與/getWriteOffList 相同??
 * @param {{
 * txid: string
 * pretxid: string
 * id: string
 * }} param
 * @returns {{
 * ?
 * }}
 */
export const setWriteOff = (param) => {
  console.log('writeOff', {param});
};

/**
 * 未入帳銷帳編輯作業
 * @param {{
 * depTxnId: string
 * usage: string
 * remark: string
 * }} param
 * @returns {{
 * isSuccess?: boolean
 * }}
 */
export const editWriteOff = (param) => {
  console.log('editWriteOff', {param});
  const request = {
    depTxnId: param.id,
    usage: param.type,
    remark: param.memo,
  };
  callAPI('/ledger/editWriteOff', request);
};
