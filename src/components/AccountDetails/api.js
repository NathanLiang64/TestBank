import { download } from 'utilities/axios';
// import { dateToYMD } from 'utilities/Generator';

/**
 * 下載交易明細清單
 * @param {*} fileType 下載檔案類型, 1:PDF, 2:EXCEL(CSV)
 * @param {*} conditions 查詢條件
 * @returns 數位存摺
 */
export const getDepositBook = async (fileType, conditions) => {
  const request = {
    conditions,
    fileType,
    pdfTemplateType: 2, // Pdf版型, 1:只有封面(可參考PdfTemplateType), 2:只有內容, 3:完整內容
  };
  await download('/api/deposit/v1/getDepositBook', request);
};
