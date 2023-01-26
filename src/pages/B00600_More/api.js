import { callAPI } from 'utilities/axios';

/**
 * 取得所有單元功能清單。
 * @returns {Promise<{
 *   groupKey: String, // 群組代碼
 *   groupName: String, // 群組名稱
 *   items: [{
 *     funcCode: String, // 功能代碼
 *     name: String, // 功能名稱
 *     url: String, // 連結
 *     icon: String, // 圖示名稱。若為 null，則表示使用預設值；否則將從 網站 img 區取得。 // TODO 還沒規劃目錄
 *     alterMsg: String, // 顯示用訊息
 *     isFavorItem: Boolean, // 表示此功能是我的最愛中的選項。
 *     isFavorite: Number, // xxx 是否已經設為我的最愛 (刪除; 因為目前只傳回 0/1 沒太大幫助)
 *     position: Number, // 用戶在我的最愛清單中的排列順序(0~11)
 *     locked: Boolean, // 表示是不可異動的功能 (推薦碼分享、優惠)
 *   }] // 單元功能清單
 * }>}
 */
export const getMoreList = async () => {
  const response = await callAPI('/function/v1/getFunctionList');
  return response.data;
};
