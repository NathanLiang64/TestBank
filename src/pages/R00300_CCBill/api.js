// import { callAPI } from 'utilities/axios';

import { checkCardBillStatus, queryCardBill, queryCardInfo } from 'pages/C00700_CreditCard/api';
// import mockBills from './mockData/mockBills';
// import mockBillDetails from './mockData/mockBillDetails';
// import mockTransactions from './mockData/mockTransactions';
import mockCreditCardTerms from './mockData/mockCreditCardTerms';

/**
 * 取得信用卡繳費單
   @param {
     "period": 期別 (ex: 202207) (僅 queryCardBill 需要)
   }
   @returns {
     "month": 本期月份。 // period末兩位數
     "amount": 本期應繳金額，無帳單時為0。 // queryCardBillRt.newBalance
     "billDate": 繳費截止日 // queryCardInfoRt.payDueDate
     "currency": 幣值 // 'TWD'
     "autoDeduct": 是否已設定自動扣繳 // checkCardBillStatusRt.autoDeductStatus
   }
 */
export const getBills = async (param) => {
  // const response = await callAPI('/api/', param);
  // const response = await new Promise((resolve) => resolve({ data: mockBills(param) }));

  /* 自不同API取得data */
  const queryCardBillRt = await queryCardBill(param);
  const checkCardBillStatusRt = await checkCardBillStatus();
  const queryCardInfoRt = await queryCardInfo();

  /* 將回傳資料轉換成頁面資料結構 */
  const bills = {
    month: parseInt(param.slice(-2), 10).toString(), // 只顯示月份，開頭不為0
    amount: queryCardBillRt.data.newBalance,
    billDate: queryCardInfoRt.data.payDueDate,
    currency: 'TWD',
    autoDeduct: checkCardBillStatusRt.data.autoDeductStatus,
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
     "targetAcct": TODO 或許這個是卡號 // queryCardBillRt.detail[n].cardNo
     "amount": 36000, // queryCardBillRt.detail[n].amount
     "currency": "TWD"
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
    targetAcct: '1112223333444455', // TODO: detail.cardNo rt null，先塞假資料待處理完成後恢復
    amount: detail.amount,
    currency: 'TWD',
  }));

  return transactionDetails;
};

/**
 * 取得帳單資訊：更多帳單資訊Accoridan
   @param {
    "period": 期別 (ex: 202207) (僅 queryCardBill 需要)
  }
   @returns {
     "currency": 信用卡帳單幣別 // 'TWD'
     "amount": 本期應繳金額 // queryCardInfoRt.newBalance
     "minAmount": 最低應繳金額 // queryCardInfoRt.minDueAmount
     "invoiceDate": 帳單結帳日 // queryCardInfoRt.billClosingDate
     "billDate": 繳費截止日 // queryCardInfoRt.payDueDate
     "prevAmount": 上期應繳金額 // queryCardBill(期別-1, if期別===01: 期別=12).newBalance ('-')
     "prevDeductedAmount": 已繳/退金額 // queryCardInfoRt.paidAmount
     "newAmount": 本期新增款項 // '-'
     "rate": 利息 // '-'
     "fine": 違約金 // '-'
     "credit": 循環信用額度 // '-'
     "creditAvailable": 循環信用本金餘額 // '-'
     "bindAccountNo": 自動扣款帳號 // '-'
     "deductAmount": 繳款截止日扣款金額 // '-'
   }
 */
export const getBillDetails = async () => {
  // Assume backend store Terms as escaped HTML...
  // const response = await new Promise((resolve) => resolve({ data: mockBillDetails }));

  const queryCardInfoRt = await queryCardInfo();

  /* 將回傳資料轉換成頁面資料結構 */
  const billDetails = {
    currency: 'TWD',
    amount: queryCardInfoRt.data.newBalance,
    minAmount: queryCardInfoRt.data.minDueAmount,
    invoiceDate: queryCardInfoRt.data.billClosingDate,
    billDate: queryCardInfoRt.data.payDueDate,
    prevAmount: '-',
    prevDeductedAmount: queryCardInfoRt.data.paidAmount,
    newAmount: '-',
    rate: '-',
    fine: '-',
    credit: '-',
    creditAvailable: '-',
    bindAccountNo: '-',
    deductAmount: '-',
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
  alert('待串接API', format === 1 ? '下載PDF' : '下載EXCEL');
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
