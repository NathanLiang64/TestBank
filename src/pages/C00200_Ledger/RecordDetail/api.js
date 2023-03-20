import { callAPI } from 'utilities/axios';

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
export const getWriteOffList = async (param) => {
  const response = await callAPI('/ledger/getLedgerTx', param);
  console.log('/getWriteOffList', {param});

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
export const setWriteOff = async (param) => {
  console.log('writeOff', {param});
  const response = await callAPI('/ledger/writeOff', param);

  return response.data;
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
export const editWriteOff = async (param) => {
  console.log('editWriteOff', {param});
  const response = await callAPI('/ledger/editWriteOff', param);

  return response.data;
};
