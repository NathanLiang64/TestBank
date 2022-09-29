// import { callAPI } from 'utilities/axios';

import { checkCardBillStatus, queryCardBill, queryCardInfo } from 'pages/C00700_CreditCard/api';
// import mockBills from './mockData/mockBills';
import mockBillDetails from './mockData/mockBillDetails';
import mockTransactions from './mockData/mockTransactions';
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
     "currency": 幣值 // 'NTD'
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
    month: param,
    amount: queryCardBillRt.data.newBalance,
    billDate: queryCardInfoRt.data.payDueDate,
    currency: 'NTD',
    autoDeduct: checkCardBillStatusRt.data.autoDeductStatus,
  };
  return bills;
  // return response.data;
};

/**
 * 取得信用卡交易明細：白底card，在 <Transactions /> 呼叫
   TODO 目前先直接複製台幣交易明細，不知需否調整
   @param {
     accountNo: 帳號, ex: 00100100063106,
     custom: 文字檢索條件, ex: 退款.
     startDate: 交易日期起日, ex: 20200101, // 已從transactions傳入
     endDate: 交易日期迄日, ex: 20210731, // 已從transactions傳入
     txnType: 摘要代碼: 1:跨轉、2:ATM、3:存款息、4:薪轉、5:付款儲存、6:自動扣繳, 可多筆,
     month: 起始月份，預設為最接近月底的日期為起始索引, ex: 202104,
     startIndex: 指定起始索引,
     direct: 方向性.1:正向(新~舊)、2:反向(舊~新)、0:雙向方向性
   }
   @returns {
     "id": TODO 需要ID之類的識別碼
     "index": 1,
     "bizDate": "20220425",
     "txnDate": "20220425",
     "txnTime": 210156,
     "description": "全家便利商店",
     "memo": "備註最多7個字",
     "targetMbrId": null,
     "targetNickName": null,
     "targetBank": "000",
     "targetAcct": TODO 或許這個是卡號
     "amount": 36000,
     "balance": 386000,
     "cdType": "d",
     "currency": "TWD"
   }
 */
export const getTransactionDetails = async (request) => {
  // const response = await callAPI('/api/', request);
  const response = await new Promise((resolve) => resolve({ data: mockTransactions(request) }));
  return response.data;
};

/**
 * 取得帳單資訊：更多帳單資訊Accoridan
   @returns {
     "currency": 信用卡帳單幣別
     "amount": 本期應繳金額
     "minAmount": 最低應繳金額
     "invoiceDate": 帳單結帳日
     "billDate": 繳費截止日
     "prevAmount": 上期應繳金額
     "prevDeductedAmount": 已繳/退金額
     "newAmount": 本期新增款項
     "rate": 利息
     "fine": 違約金
     "credit": 循環信用額度
     "creditAvailable": 循環信用本金餘額
     "bindAccountNo": 自動扣款帳號
     "deductAmount": 繳款截止日扣款金額
   }
 */
export const getBillDetails = async () => {
  // Assume backend store Terms as escaped HTML...
  const response = await new Promise((resolve) => resolve({ data: mockBillDetails }));
  return response.data;
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
