import { download } from 'utilities/axios';

/**
 * 下載交易明細清單
 * @param {*} fileType 下載檔案類型, 0:PDF, 1:EXCEL(CSV)
 * @param {*} conditions 查詢條件
 * @returns 數位存摺
 */
export const getDepositBook = async (fileType, conditions) => {
  const request = {
    fileType,
    ...conditions,
  };
  await download('/deposit/account/v1/getBankbook', request);
};
