// import { callAPI } from 'utilities/axios';

import {
  checkCardBillStatus, getBillDetail, queryCardBill,
} from 'pages/C00700_CreditCard/api';
import { showCustomPrompt } from 'utilities/MessageModal';
// import mockBills from './mockData/mockBills';
// import mockBillDetails from './mockData/mockBillDetails';
// import mockTransactions from './mockData/mockTransactions';
import mockCreditCardTerms from './mockData/mockCreditCardTerms';

/**
 * 取得信用卡繳費單
   @param {
     "period": 期別 (ex: 202207) (queryCardBill, getBillDetail 需要)
   }
   @returns {
     "month": 本期月份。 // period末兩位數
     "amount": 本期應繳金額，無帳單時為0。 // queryCardBillRt.newBalance
     "billDate": 繳費截止日 // queryCardInfoRt.payDueDate
     "currency": 幣值 // 'NTD'
     "autoDeduct": 是否已設定自動扣繳 // checkCardBillStatusRt.autoDeductStatus
     "hintToPay": 繳費提示文字 // checkCardBillStatusRt.hintToPay
   }
 */
export const getBills = async (param) => {
  // const response = await callAPI('/api/', param);
  // const response = await new Promise((resolve) => resolve({ data: mockBills(param) }));

  /* 自不同API取得data */
  const queryCardBillRt = await queryCardBill(param);
  const checkCardBillStatusRt = await checkCardBillStatus();
  const billDetail = await getBillDetail(param);

  /* 將回傳資料轉換成頁面資料結構 */
  const bills = {
    month: param, // 只顯示月份，開頭不為0
    amount: queryCardBillRt.data.newBalance,
    billDate: billDetail.data.payDueDate,
    currency: 'NTD',
    autoDeduct: checkCardBillStatusRt.data.autoDeductStatus,
    hintToPay: checkCardBillStatusRt.data.hintToPay,
  };
  return bills;
  // return response.data;
};

/**
 * 取得信用卡交易明細：白底card，在 <Transactions /> 呼叫
   @param {
    "period": 期別 (ex: 202207) (僅 queryCardBill 需要)
  }
   @returns {
     "txnDate": "20220425", // queryCardBillRt.detail[n].txDate
     "description": "全家便利商店", // queryCardBillRt.detail[n].desc
     "targetAcct": 卡號 // queryCardBillRt.detail[n].cardNo
     "amount": 36000, // queryCardBillRt.detail[n].amount
     "currency": "NTD"
   }
 */
export const getTransactionDetails = async (request) => {
  // const response = await callAPI('/api/', request);
  // const response = await new Promise((resolve) => resolve({ data: mockTransactions(request) }));

  const queryCardBillRt = await queryCardBill(request);

  /* 將回傳資料轉換成頁面資料結構 */
  const transactionDetails = queryCardBillRt.data.details.map((detail) => ({
    txnDate: detail.txDate,
    description: detail.desc,
    targetAcct: detail.cardNo,
    amount: detail.amount,
    currency: 'NTD',
  }));

  return transactionDetails;
};

/**
 * 取得帳單資訊：更多帳單資訊Accoridan
   @param {
    "period": 期別 (ex: 202207)
  }
   @returns {
     "currency": 信用卡帳單幣別 // 'NTD'
     "amount": 本期應繳金額 // newBalance
     "minAmount": 最低應繳金額 // minDueAmount
     "invoiceDate": 帳單結帳日 // billClosingDate
     "billDate": 繳費截止日 // payDueDate
     "prevAmount": 上期應繳金額 // prevBalance
     "prevDeductedAmount": 已繳/退金額 // paidRefundAmount
     "newAmount": 本期新增款項 // newPurchaseAmount
     "rate": 利息 // interestFee
     "fine": 違約金 // cardPenalty
     "credit": 循環信用額度 // revCreditLimit
     "creditAvailable": 循環信用本金餘額 // revgCreditPrinBalance
     "bindAccountNo": 自動扣款帳號 // autoPayAccount
     "deductAmount": 繳款截止日扣款金額 // paidAmountOnDueDate
   }
 */
export const getBillDetails = async (request) => {
  // Assume backend store Terms as escaped HTML...
  // const response = await new Promise((resolve) => resolve({ data: mockBillDetails }));

  // const billDetail = getBillDetails(request);
  const billDetail = await getBillDetail(request);
  // console.log('R00300 getBillDetails() data:', billDetail.data);

  /* 將回傳資料轉換成頁面資料結構 */
  const billDetails = {
    currency: 'NTD',
    amount: billDetail.data.newBalance,
    minAmount: billDetail.data.minDueAmount,
    invoiceDate: billDetail.data.billClosingDate,
    billDate: billDetail.data.payDueDate,
    prevAmount: billDetail.data.prevBalance,
    prevDeductedAmount: billDetail.data.paidRefundAmount,
    newAmount: billDetail.data.newPurchaseAmount,
    rate: billDetail.data.interestFee,
    fine: billDetail.data.cardPenalty,
    credit: billDetail.data.revCreditLimit,
    creditAvailable: billDetail.data.revgCreditPrinBalance,
    bindAccountNo: billDetail.data.autoPayAccount,
    deductAmount: billDetail.data.paidAmountOnDueDate,
  };

  return billDetails;
  // return response.data;
};

/**
 * 下載帳單
   TODO 不確定是否需要其他query條件，是否回傳檔案網址
   @param {
      "fileType": 1 = pdf 或 2 = excel
   }
   @returns {
     "url": 檔案URL。
   }
 */
export const getInvoice = async (format) => {
  /* TODO
  if (fileType === 1) {
    await downloadPDF('/api/deposit/v1/getDepositBook', request, `${filename}.pdf`);
  } else if (fileType === 2) {
    await downloadCSV('/api/deposit/v1/getDepositBook', request, `${filename}.csv`);
  }
  */
  // alert('待串接API', format === 1 ? '下載PDF' : '下載EXCEL');
  await showCustomPrompt({
    title: '待串接API',
    message: `${format === 1 ? '下載PDF' : '下載EXCEL'}`,
    noDismiss: true,
  });
};

/**
 * 取得信用卡注意事項
 * @returns
 */
export const getCreditCardTerms = async () => {
  // Assume backend store Terms as escaped HTML...
  const response = await new Promise((resolve) => resolve({ data: decodeURI(mockCreditCardTerms) }));
  return response.data;
};
