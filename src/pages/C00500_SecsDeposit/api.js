import { callAPI, download } from 'utilities/axios';

/**
 * 取得當前所選帳號之交易明細
 * @param {*} accountNo 存款帳號, ex: 00100100063106
 * @returns 帳戶往來明細清單
    {
        "index": 1,
        "bizDate": "20220425",
        "txnDate": "20220425",
        "txnTime": 210156,
        "description": "現金",
        "memo": null,
        "targetMbrId": null,
        "targetNickName": null,
        "targetBank": "000",
        "targetAcct": null,
        "amount": 36000,
        "balance": 386000,
        "cdType": "d",
        "currency": "TWD"
    }
 */
export const getTransactions = async (accountNo) => {
  const response = await callAPI('/api/deposit/v1/getTransactions', { accountNo, currency: 'NTD' });
  return response.data;
};

/**
 * 下載存摺封面
 * @param {*} accountNo 存款帳號
 * @returns 存摺封面
 */
export const downloadDepositBookCover = async (accountNo) => {
  await download('/deposit/account/v1/getBankbookCover', { accountNo });
};

/**
 * 設定存款帳戶別名
 * @param {*} accountNo 存款帳號
 * @param {*} alias 帳戶別名；若為空值，則會恢復原始帳戶名稱
 * @returns
 */
export const setAccountAlias = async (accountNo, alias) => {
  const response = await callAPI('/api/deposit/v1/setAccountAlias', { accountNo, alias });
  return response.data;
};
