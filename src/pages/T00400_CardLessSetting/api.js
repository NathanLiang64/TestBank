import { callAPI } from 'utilities/axios';

/**
 * 取得無卡提款狀態
 * @returns {Promise<Number>} 無卡提款狀態。 0-未申請 1-已申請未開通 2-已開通 3-已註銷 4-已失效 5-其他
 */
export const getStatus = async () => {
  const response = await callAPI('/deposit/withdraw/getStatus');
  return response.data;
};

/**
 * 開通/註銷 無卡提款服務
 * 注意: 無卡提款狀態為 0, 3, 4，執行 [申請加開通] / 無卡提款狀態為 2，執行 [註銷]  / 無卡提款狀態為 1 ，執行 [開通]
 * @param pinCode (註銷時放空白)
 * @returns {Promise<Boolean>} 表示執行結果的旗標。
 */
export const activate = async (pinCode) => {
  const response = await callAPI('/deposit/withdraw/cardless/activate', pinCode);
  return response;
};
