import { callAPI } from 'utilities/axios';

import mockTerms from './terms';

/**
 * 取得存款帳戶卡片所需的資訊
 * @param {*} acctType 帳戶類型 M:母帳戶, S:證券戶, F:外幣帳戶, C:子帳戶
 * @returns 存款帳戶資訊。
 */
export const getAccountSummary = async (acctTypes) => {
  const response = await callAPI('/api/deposit/v1/getAccountSummary', acctTypes);
  return response.data.map((acct) => ({
    acctBranch: acct.branch, // 分行代碼
    acctName: acct.name, // 帳戶名稱或暱稱
    acctId: acct.account, // 帳號
    acctType: acct.type, // 帳號類別
    acctBalx: acct.balance, // 帳戶餘額
    ccyCd: acct.currency, // 幣別代碼
  }));
};

/**
 * 取得當前所選帳號之交易明細
 * @param {*} request {
    accountNo: 帳號, ex: 00100100063106,
    custom: 文字檢索條件, ex: 退款.
    startDate: 交易日期起日, ex: 20200101,
    endDate: 交易日期迄日, ex: 20210731,
    txnType: 摘要代碼: 1:跨轉、2:ATM、3:存款息、4:薪轉、5:付款儲存、6:自動扣繳, 可多筆,
    month: 起始月份，預設為最接近月底的日期為起始索引, ex: 202104,
    startIndex: 指定起始索引,
    direct: 方向性.1:正向(新~舊)、2:反向(舊~新)、0:雙向方向性
  }
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
export const getTransactionDetails = async (request) => {
  const response = await callAPI('/api/deposit/v1/getTransactions', request);
  return response.data;
};

/**
 * 取得目前用戶的存錢計劃清單
 * @returns {object}
 {
    plans: [{ // 進行中的計劃數量
      planId, // 計劃代碼（UUID 型式），可以用來取得圖片。 直接組合 URL/images/dp/plans.planId.jpg
      progInfo: { // 存錢計劃適用方案(Program)資訊
        code: 代碼，應跟優利的代碼一致。
        type: 類型：0.基本方案, 1.行銷活動方案.
        name: 名稱
        rate: 計息利率，例: 0.6；僅供顯示用，不會拿來計息。
        description: 詳細說明。
      },
      imageId, // Title圖片（預設代碼: 0,1~6），若是由用戶上傳的Base64影像資料，則在建立成功後再透過 updateDepositPlan 上傳
      name, // 計劃名稱（最多七個字），若為 progCode=行銷活動方案 則為方案名稱。
      startDate, // 計劃啟動時間，格式：yyyyMMdd
      endDate, // 計劃結束時間，格式：yyyyMMdd
      cycleMode, // 存入週期（1.每周、2.每月）
      cycleTiming, // 存入時機；每周：0～6(周日～周六)、每月：1~28及月底(31)
      amount, // 每期存入金額，格式：99999。
      period, // 計劃存入期數
      goalAmount: // 依 amount * 期數 計算出的計劃目標存款金額。
      bindAccountNo, // 綁定的子帳戶（帳號、餘額）
      currentBalance, // 目前子帳戶的存款餘額
      isMaster, // 表示呈現在APP首頁的主要計劃，即進存錢計劃功能的預設開啟計劃。
    }, ...],
    subAccounts: [{ // 可用子帳戶清單及是否有餘額，已排除綁定其他用途的子帳戶
      accountNo, // 子帳戶的帳號
      balance, // 帳戶餘額
    }, ...]
    totalSubAccountCount, // 此用戶已擁有的子帳戶數量（不區分用途）
 */
export const getDepositPlans = async () => {
  const response = await callAPI('/api/depositPlan/v1/getAllPlans');
  return response.data;
};

/**
 * 取得存錢計劃適用方案(Program)資訊，已停用或不在有效期限內的方案不會列在清單中。
 * @returns {object}
 * @return [{
 *   code: 代碼，應跟優利的代碼一致。
 *   type: 類型：0.基本方案, 1.行銷活動方案.
 *   name: 名稱
 *   rate: 計息利率，例: 0.6；僅供顯示用，不會拿來計息。
 *   description: 詳細說明。
 *   amountRange: {
 *      week: { 存入週期（1.每周）時，的上下限金額。例：{ min: 100, max: 50000 }
 *        min: 0,
 *        max: 0
 *      }
 *      month: { 存入週期（2.每月）時，的上下限金額。例：{ min: 10000, max: 500000 }
 *        min: 0,
 *        max: 0
 *      }
 *   }
 * }, ...]
 */
export const getDepositPlanProgram = async () => {
  const response = await callAPI('/api/depositPlan/v1/getPrograms');
  return response.data;
};

/**
 * 建立存錢計劃
 * @param {*} request {
 *    progCode, // 方案代碼。（0＝基本計劃、other=活動的計劃）；此欄位不可為空值。
 *    imageId, // Title圖片（預設代碼: 0,1~6），若是由用戶上傳的Base64影像資料，則在建立成功後再透過 updateDepositPlan 上傳；此欄位不可為空值。
 *    name, // 計劃名稱（最多七個字），若為 progCode=行銷活動方案 則為空值。
 *    startDate, // 計劃啟動時間，格式：yyyyMMdd。此欄位不可為空值。
 *    endDate, // 計劃結束時間，格式：yyyyMMdd。此欄位不可為空值。實際存入值，會依周期調整，所以不一定是以傳人的值寫入DB。
 *    cycleMode, // 存入週期（1.每周、2.每月）；此欄位不可為空值。
 *    cycleTiming, // 存入時機；每周：0～6(周日～周六)、每月1~28或月底(31)；此欄位不可為空值。
 *    amount, // 每共月存入金額，格式：99999。此欄位不可為空值。
 *    bindAccountNo, // 使用的子帳戶，例：04300491000001；若子帳戶為空值，表示建立新子帳戶。
 *    currentBalance, // 目前子帳戶的存款餘額。
 * }
 * @returns {
 *   {boolean} result: API執行結果。
 *   planId: 計劃代碼（UUID 型式）。有值表示建立成功；若為 null 表示建立失敗，會傳回錯誤。
 *   currentBalance, // 目前子帳戶的存款餘額, 可以用來判斷是否立即轉帳成功。
 * }
 */
export const createDepositPlan = async (request) => {
  // Rule:
  //    1. Max(plans.count) is 3
  //    2. Max(totalSubAccountCount) is 8
  //    3. subAccounts.count must > 0
  // 沒有可用(建)子帳戶時，則提示「*****」
  const response = await callAPI('/api/depositPlan/v1/create', request);
  return response.data;
};

/**
 * 更新存錢計劃資訊
 * @param request {
 *    planId, // 計劃代碼（UUID 型式）
 *    name, // 新的計劃名稱（最多七個字）；若為 null，則表示不變更。
 *    image, // Title圖片（前端自訂代碼 或 由用戶上傳的Base64影像資料；空字串表示不變更）
 *    isMaster, // 表示主要計劃的旗標；若為 null，則表示不變更。
 * }
 * @returns {
 *   {boolean} result: API執行結果。
 * }
 */
export const updateDepositPlan = async (request) => {
  const response = await callAPI('/api/depositPlan/v1/update', request);
  return response.data;
};

/**
 * 結束存錢計劃，並將往來記錄以數位存摺模式寄給用戶。
 * @param {*} {
 *   planId 計劃代碼（UUID 型式）
 * }
 * @returns {
 *   {boolean} result: API執行結果。
 *   email: 存錢計畫、存錢歷程打包成PDF檔(需要加密)的寄送郵箱。
 * }
 */
export const closeDepositPlan = async (planId) => {
  // 有沒有達標，前端可判斷，因為有帳戶餘額及目標金額
  const response = await callAPI('/api/depositPlan/v1/close', planId);
  return response.data;
};

/**
 * 取得存錢計畫服務條款
 * @returns
 */
export const getDepositPlanTerms = async () => {
  // Assume backend store Terms as escaped HTML...
  const response = await new Promise((resolve) => resolve({ data: decodeURI(mockTerms) }));
  return response.data;
};
