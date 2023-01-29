import { callAPI, download } from 'utilities/axios';

/**
 * 查詢分帳還款紀錄
 *
 * @param token
 * @param {
 *    account:    放款帳號(每人一個)   ex: 02905000006466
 *    subNo:      分帳序號            ex: 0001
 *    startDate:  查詢起日            (西元年 20220131) 統一用西元年
 *    endDate:    查詢迄日            (西元年 20220228) 統一用西元年
 *  }
 * @return [{
 *    date:           交易日期                L0106.txDate
 *    amount:         繳款金額 (=應繳金額)    L0106.txAmt
 *    balance:        貸款餘額 (=本金餘額     L0106.actBal
 *    type:           交易種類  ex: 還本付息  L0106.txCd
 *    splitPrincipal: 攤還本金                L0106.priAmt
 *    interest:       利息                    L0106.intAmt
 *    overInterest:   逾期息                  L0106.dintAmt
 *    defaultAmount:  違約金                  L0106.dfAmt
 *    rate:           計息利率                L0106.fitIrt
 *   }...
 * ]
 *
 */
export const getSubPaymentHistory = async (param) => {
  const response = await callAPI('/loan/v1/getSubPaymentHistory', param);
  return response.data;
};

/**
 * 下載繳款紀錄 PDF & Excel
 *
 * @param token
 * @param rq
 * {
 *  account: 放款帳號(每人一個) ex: 02905000006466
 *  subNo: 分帳序號 ex: 0001
 *  startDate: 查詢起日 (西元年 20220131) 統一用西元年
 *  endDate: 查詢迄日 (西元年 20220228) 統一用西元年
 * }
 *
 * @return
 * {
 *  filename: 檔案名稱 (例如: "776f367b57b14ddb894f9912f67ece11.pdf")
 * }
 * "下載繳款紀錄PDF": /loan/v1/downloadPaymentHistory.pdf
 * "下載繳款紀錄Excel": /loan/v1/downloadPaymentHistory.xlsx
*/
export const downloadPaymentHistory = async ({param, fileType}) => {
  let downloadUrl;

  switch (fileType) {
    case 1:
      downloadUrl = '/loan/v1/downloadPaymentHistory.pdf';
      break;
    default:
      downloadUrl = '/loan/v1/downloadPaymentHistory.xlsx';
      break;
  }

  await download(downloadUrl, param);
};
