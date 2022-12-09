import { callAPI } from 'utilities/axios';
import { showCustomPrompt } from 'utilities/MessageModal';
import mockLoanRewards from './mockData/mockRewards';

/**
 * 可能回饋 - 取得回饋紀錄 DEBUG: mock
   @param {
     accountNo: 指定貸款帳號
     month: 指定月份，或null、undefined為最近的六個月
   }
   @returns {
     rewards: 可能回饋，未參加回饋挑戰可忽略
     isJoinedRewardProgram: 是否參加回饋挑戰
     currency: 幣別
     transactions: [
       {
         isSuccess: 挑戰成功或失敗
         txnDate: 交易日期
         amount: 利息金額，挑戰失敗可忽略
         rate: 利息（不含%），挑戰失敗可忽略
         currency: 幣別，挑戰失敗可忽略
       }, ...]
   }
 */
export const getLoanRewards = async (param) => {
  // const response = await callAPI('/api/');
  const response = await new Promise((resolve) => resolve({ data: mockLoanRewards(param) }));
  return response.data;
};

/**
 * 下載合約 TODO: 未有API
   @param {
      accountNo: 貸款號
      fileType: 1 = pdf 或 2 = excel
   }
   @returns {
     url: 檔案URL。
   }
 */
export const getContract = async (param) => {
  /* TODO
  if (fileType === 1) {
    await downloadPDF('/api/deposit/v1/getDepositBook', request, `${filename}.pdf`);
  } else if (fileType === 2) {
    await downloadCSV('/api/deposit/v1/getDepositBook', request, `${filename}.csv`);
  }
  */
  const { accountNo, format } = param;
  // alert(`待串接API，下載合約貸款號：${accountNo}`, format === 1 ? '下載PDF' : '下載EXCEL');
  await showCustomPrompt({title: '待串接API', message: `下載合約貸款號：${accountNo}：${format === 1 ? '下載PDF' : '下載EXCEL'}`});
};

/**
 * 下載清償證明 TODO: 未有API
   @param {
      accountNo: 貸款號
      fileType: 1 = pdf 或 2 = excel
   }
   @returns {
     url: 檔案URL。
   }
 */
export const getStatment = async (param) => {
  /* TODO
  if (fileType === 1) {
    await downloadPDF('/api/deposit/v1/getDepositBook', request, `${filename}.pdf`);
  } else if (fileType === 2) {
    await downloadCSV('/api/deposit/v1/getDepositBook', request, `${filename}.csv`);
  }
  */
  const { accountNo, format } = param;
  // alert(`待串接API，下載證明貸款號：${accountNo}`, format === 1 ? '下載PDF' : '下載EXCEL');
  await showCustomPrompt({title: '待串接API', message: `下載證明貸款號${accountNo}：${format === 1 ? '下載PDF' : '下載EXCEL'}`});
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
  const response = await callAPI('/api/loan/v1/getSubSummary', request);
  return response.data;
};

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
  const response = await callAPI('/api/loan/v1/getSubPaymentHistory', param);
  return response;
};

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
  const response = await callAPI('/api/loan/v1/getSubPayment', param);
  return response.data;
};

/**
 * 貸款資訊查詢
 * @param {{
 * account: 放款帳號
 * subNo: 分號
 * }} param
 * @returns {{
 * startDate: 貸款起日
 * endDate: 貸款迄日
 * dateToPay: 每期還款(日期)
 * txAmt: 初貸金額
 * rate: 貸款利率
 * loanBalance: 貸款餘額
 * periodPaid: 已繳期數
 * periodRemaining: 剩餘期數
 * type: 貸款類別 //TODO 主機尚未提供
 * }}
 */
export const getInfo = async (param) => {
  const response = await callAPI('/api/loan/v1/getInfo', param);

  const loadDetail = {
    type: '信貸',
    ...response.data,
  };

  return loadDetail;
};
