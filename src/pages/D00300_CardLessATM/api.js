import { callAPI } from 'utilities/axios';

// 檢查無卡提款狀態 done
export const getCardlessStatus = async (param) => {
  const response = await callAPI('/api/cardlessWD/getStatus', param);
  // const response = {
  //   data:
  //   // { cwdStatus: '1', newSiteRegist: param, message: 'cwdStatus 1 message' },
  //   // { cwdStatus: '2', newSiteRegist: param, message: 'cwdStatus 2 message' },
  //   // { cwdStatus: '3', newSiteRegist: param, message: 'cwdStatus 3 message' },
  // };
  return response;
};

// 取得提款卡資訊 done
export const getAccountSummary = async (param) => {
  const response = await callAPI('/api/cardlessWD/deposit/getAccountSummary', param);
  return response.data;
};

// 申請無卡提款 done
export const cardLessWithdrawApply = async (param) => {
  const response = await callAPI('/api/cardlessWD/withdrawal', param);
  return response.data;
};

/**
 * 開通無卡提款服務 測試時須請ken幫忙協助reset無卡提款狀態
 *
 * @param token
 * @return {
 *    message: 回傳訊息 例如: 'E660: 申請不准'
 *    chgPwMessage: 空白表示成功
 * }
 * @throws Exception
 */
export const cardLessWithdrawActivate = async (param) => {
  const response = await callAPI('/api/cardlessWD/activate', param);
  return response.data;
};
