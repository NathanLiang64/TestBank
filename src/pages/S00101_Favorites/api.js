import { callAPI } from 'utilities/axios';

/**
 * 取得可提供用戶選擇加入最愛的單元功能清單
 * @returns {Promise<{
 *   groupKey: String, // 群組代碼
 *   groupName: String, // 群組名稱
 *   items: [{
 *     funcCode: String, // 功能代碼
 *     name: String, // 功能名稱
 *     url: String, // 連結
 *     icon: String, // 圖示
 *     alterMsg: String, // 顯示用訊息
 *     isFavorItem: Boolean, // 表示此功能是我的最愛中的選項。
 *     isFavorite: Number, // xxx 是否已經設為我的最愛 (刪除; 因為目前只傳回 0/1 沒太大幫助)
 *     position: Number, // 用戶在我的最愛清單中的排列順序(0~11)
 *     locked: Boolean, // 表示是不可異動的功能 (推薦碼分享、優惠)
 *   }] // 單元功能清單
 * }>}
 */
export const getAllFunc = async () => {
  const response = await callAPI('/function/favorites/v1/getAllFunc');
  return response.data;
};

/**
 * 取得目前用戶設定的所有最愛單元功能清單。
 * @returns {Promise<[{
 *   funcCode: String, // 功能代碼
 *   name: String, // 功能名稱
 *   url: String, // 連結
 *   icon: String, // 圖示
 *   alterMsg: String, // 顯示用訊息
 *   isFavorItem: Boolean, // 表示此功能是我的最愛中的選項。
 *   isFavorite: Number, // xxx 是否已經設為我的最愛 (刪除; 因為目前只傳回 0/1 沒太大幫助)
 *   position: Number, // 用戶在我的最愛清單中的排列順序(0~11)
 *   locked: Boolean, // 表示是不可異動的功能 (推薦碼分享、優惠)
 * }]>}
 */
export const getMyFuncs = async () => {
  const response = await callAPI('/function/favorites/v1/getMyFuncs');
  return response.data;
};

/**
 * 新增或刪除指定用戶的最愛的單元功能。
 * @param {[{
 *   funcCode: String, // 功能代碼
 *   position: Number, // 用戶在我的最愛清單中的排列順序(0~11)，若此欄位的值為 null 表示刪除。
 *   params： String, // 執行此功能時的啟動參數
 * }]} settings 有異動的功能的設定資訊。
 */
export const saveMyFuncs = async (settings) => {
  const response = await callAPI('/function/favorites/v1/saveMyFuncs', settings);
  return response.data;
};
