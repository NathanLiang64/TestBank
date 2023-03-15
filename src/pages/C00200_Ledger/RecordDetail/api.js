/* eslint-disable no-unused-vars */
import { callAPI } from 'utilities/axios';
import { mockWriteOffListRt } from './mockData';

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
  // const response = callAPI('/ledger/getLedgerTx', param); // TODO 解開註解移除下方mock
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
 * 未入帳銷帳作業
 * @param {{
 * depTxnId: string
 * txnId: string
 * }} param
 * @returns {{
 * boolean
 * }}
 */
export const setWriteOff = (param) => {
  console.log('writeOff', {param});
  // callAPI('/ledger/writeOff', param); // TODO 解開註解移除下方mock

  return true; // DEBUG mock return
};

/**
 * 未入帳/已入帳明細編輯作業
 * @param {{
 * depTxnId: string
 * usage: string
 * remark: string
 * }} param
 * @returns {{
 * boolean
 * }}
 */
export const editWriteOff = (param) => {
  const request = {
    depTxnId: param.id,
    usage: param.type,
    remark: param.memo,
  };
  console.log('editWriteOff', {request});
  // callAPI('/ledger/editWriteOff', request); // TODO 解開註解移除下方mock

  return true; // DEBUG mock return
};
