const mockModel = {
  txDate: '20220222',
  txAmount: '800',
  txUsage: '1',
  bankCode: '812',
  bankAccount: '0000888899980001',
  txDesc: '車票',
  memberNickName: 'AAA',
  isEditable: true,
  txStatus: 2, // 0: 不明, 1: 已入帳, 2: 未入帳
  isOwner: true,
}; // DEBUG mock data

/**
 * 取得單一帳本明細
 * @param {{
 * txid: string
 * }} param
 * @returns {{
 * txDate: string
 * txAmount: number
 * txUsage: string
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
  console.log('getLedgerTx', {param}); // {txid: string}
  const response = {
    code: '0000',
    data: mockModel,
  };

  return response.data;
};

/**
 * 編輯帳本明細
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
 * 取得可銷帳清單
 * @param {{
 * off: string
 * }} param
 * @returns {{
 * ?
 * }}
 */
export const writeOffList = (param) => {
  console.log('writeOffList', {param});
  const response = {};

  return response;
};

/**
 * 未入帳銷帳作業
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
  console.log('ledgerTxEdit', {param});
};

/**
 * 未入帳銷帳編輯作業
 * @param {{
 * txid: string
 * id: string
 * usage: string
 * remark: string
 * }} param
 * @returns {{
 * ?
 * }}
 */
export const editWriteOff = (param) => {
  console.log('editWriteOff', {param});
};
