import { getBillSummary } from './api';

/**
 * 取得單月信用卡交易明細：白底card，在 <Transactions /> 呼叫
   @param {
    "period": 期別 (ex: 202207)
  }
   @returns {
     "txnDate": "20220425", // getBillSummary.detail[n].txDate
     "description": "全家便利商店", // getBillSummary.detail[n].desc
     "targetAcct": 卡號 // getBillSummary.detail[n].cardNo
     "amount": 36000, // getBillSummary.detail[n].amount
     "currency": "NTD"
   }
 */
export const getTransactionDetails = async (param) => {
  const getBillSummaryRt = await getBillSummary(param);

  return getBillSummaryRt.details.map((detail) => ({
    txnDate: detail.txDate,
    description: detail.desc,
    targetAcct: detail.cardNo,
    amount: detail.amount,
    currency: 'NTD',
  }));
};
