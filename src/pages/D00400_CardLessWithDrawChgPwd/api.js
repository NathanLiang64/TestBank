import { callAPI } from 'utilities/axios';

/**
 * 變更無卡提款密碼
 * @param {{
      oldPassword: String,
      newPassword: String,
    }} request
 * @returns {Promise<Boolean>} 表示執行結果的旗標。
 */
export const setPinCode = async (request) => {
  const response = await callAPI('/deposit/cardless/setPinCode', request);
  return response;
};

/**
 * 檢查無卡提款狀態
 * @returns {Promisr<Number>} 無卡提款狀態。 0-未申請 1-已申請未開通 2-已開通 3-已註銷 4-已失效 5-其他
 */
export const getCardlessWdStatus = async () => {
  const response = await callAPI('/deposit/withdraw/getStatus');
  return response.data;
};
