import { callAPI } from 'utilities/axios';

/**
 * 查詢分帳應繳資訊
 *
 * @param token
 * @param {
 *    account:  放款帳號(每人一個)   ex: 02905000006466
 *    subNo:    分號                ex: 0001
 *   }
 * @return [{
 *    amount          本期應繳金額    L0102.PRIAMT + L0102.INTAMT + L0102.DIAMT + L0102.DFAMT
 *    startDate       計息期間起      L0102.OSDATE
 *    endDate         計息期間迄      L0102.OEDATE
 *    rate            利率%           L0102.FITIRT
 *    principal       計息本金        L0102.INTPRT
 *    splitPrincipal  攤還本金        L0102.PRIAMT
 *    interest        利息            L0102.INTAMT
 *    overInterest    逾期息          L0102.DIAMT
 *    defaultAmount   違約金          L0102.DFAMT
 * }]
 *
 */
export const getSubPayment = async (param) => {
  const response = await callAPI('/loan/v1/getSubPayment', param);
  return response.data;
};

/**
 * 查詢分帳應繳摘要資訊 (用於子首頁)。
 *
 * @param token
 * @return [{
 *      account       放款帳號 (每人在遠銀只有一個)
 *      subNo         分帳序號 (每次貸款一個序號)    L0003.sqno
 *      balance       貸放餘額                      L0003.actbal
 *      payDate       應繳日期                      L0101.CNIRDT
 *      payAmount     應繳本息                      L0101.ISTPRT
 *      debitAccount  扣款帳號                      L0101.PAYACTNO
 *    }...
 * ]
 */
export const getSubSummary = async (request) => {
  const response = await callAPI('/loan/v1/getSubSummary', request);
  return response.data;
};
