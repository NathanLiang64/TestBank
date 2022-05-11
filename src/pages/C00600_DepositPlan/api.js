import { callAPI } from 'utilities/axios';

/**
 * 取得目前用戶的存錢計劃清單
 * @returns {object}
 {
    plans: [{ // 進行中的計劃數量
      planId, // 計劃代碼（UUID 型式），可以用來取得圖片。 直接組合 URL/images/dp/plans.planId.jpg
      progCode, // 方案代碼。（0＝基本計劃、other=活動的計劃）
      imageId, // Title圖片（預設代碼: 1~6），若是由用戶上傳的Base64影像資料，則在建立成功後再透過 updateDepositPlan 上傳
      name, // 計劃名稱（最多七個字）
      startDate, // 計劃啟動時間，格式：yyyyMMdd
      endDate, // 計劃結束時間，格式：yyyyMMdd
      cycleMode, // 存入週期（1.每周、2.每月）
      cycleTime, // 存入時機；每周：0～6(周日～周六)、每月1~31(月底依月份調整)
      amount, // 每共月存入金額，格式：99999。
      subAccountNo, // 使用的子帳戶，例：04300491000001；若子帳戶為空值，表示建立新子帳戶。
      bindAccountNo, // 綁定的子帳戶（帳號、餘額）
      isMaster, // 表示呈現在APP首頁的主要計劃，即進存錢計劃功能的預設開啟計劃。
    }, ...],
    subAccounts: [{ // 可用子帳戶清單及是否有餘額，已排除綁定其他用途的子帳戶
      accountNo, // 子帳戶的帳號
      balance, // 帳戶餘額
    }, ...]
    totalSubAccountCount, // 此用戶已擁有的子帳戶數量（不區分用途）
 */
export const getDepositPlans = async () => {
  const response = await callAPI('/api/depositPlus/v1/getDepositPlans');
  return response.data;
};

/**
 * 取得存錢計劃適用方案
 * @returns {object}
 [{
   progCode, // 方案代碼。（0＝基本計劃、other=活動的計劃）
   description, // 方案說明
   rate, // 方案計息利率，例: 0.6
 }, ...]
 */
export const getDepositPlanProgram = async () => {
  const response = await callAPI('/api/depositPlus/v1/getDepositPlanProgram');
  return response.data;
};

/**
 * 建立存錢計劃
 * @param {*} request {
 *    progCode, // 方案代碼。（0＝基本計劃、other=活動的計劃）；此欄位不可為空值。
 *    imageId, // Title圖片（預設代碼: 1~6），若是由用戶上傳的Base64影像資料，則在建立成功後再透過 updateDepositPlan 上傳；此欄位不可為空值。
 *    name, // 計劃名稱（最多七個字）；此欄位不可為空值。
 *    // startDate, // 計劃啟動時間，格式：yyyyMMdd。此欄位不可為空值。 （ Note：不用提供，一定是建立當日，因為要扣款成功才能建立）
 *    endDate, // 計劃結束時間，格式：yyyyMMdd。此欄位不可為空值。實際存入值，會依周期調整，所以不一定是以傳人的值寫入DB。
 *    cycleMode, // 存入週期（1.每周、2.每月）；此欄位不可為空值。
 *    cycleTime, // 存入時機；每周：0～6(周日～周六)、每月1~31(月底依月份調整)；此欄位不可為空值。
 *    amount, // 每共月存入金額，格式：99999。此欄位不可為空值。
 *    subAccountNo, // 使用的子帳戶，例：04300491000001；若子帳戶為空值，表示建立新子帳戶。此欄位不可為空值。
 * }
 * @returns 計劃代碼（planId, UUID 型式）。有值表示建立成功；若為 null 表示建立失敗，會傳回錯誤。
 */
export const createDepositPlan = async (request) => {
  // Rule:
  //    1. Max(plans.count) is 3
  //    2. Max(totalSubAccountCount) is 8
  //    3. subAccounts.count must > 0
  // 沒有可用(建)子帳戶時，則提示「*****」
  const response = await callAPI('/api/depositPlus/v1/createDepositPlan', request);
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
 */
export const updateDepositPlan = async (request) => {
  const response = await callAPI('/api/depositPlus/v1/updateDepositPlan', request);
  return response.data;
};

/**
 * 結束存錢計劃
 * @param {*} planId 計劃代碼（UUID 型式）
 * @returns
 */
export const closeDepositPlan = async (planId) => {
  // 有沒有達標，前端可判斷，因為有帳戶餘額及目標金額
  const response = await callAPI('/api/depositPlus/v1/closeDepositPlan', planId);
  return response.data;
};
