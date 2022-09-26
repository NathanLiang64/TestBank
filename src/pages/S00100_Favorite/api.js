import { callAPI } from 'utilities/axios';

/**
 * (我的最愛)取得提供設定的項目選單
 * @return{
 *   groupKey:  群組代碼
 *   groupName: 群組名稱
 *   items {
 *      actKey:     功能代碼
 *      name:       功能名稱
 *      url:        連結
 *      icon:       圖示
 *      groupType:  權限參數
 *      alterMsg:   顯示用訊息
 *      isFavorite: 是否已經設為我的最愛
 *      position:   位置資訊
 *   },...
 * }
 * @throws Exception
 */
export const getFavoriteSettingList = async () => {
  const response = await callAPI('/api/menu/favoriteFunc/v1/setting');
  return response.data;
};
/**
 * (我的最愛)取得已設定的項目清單(最多12個)
 * @return{
 *   actKey:    功能代碼
 *   name:      功能名稱
 *   url:       連結
 *   icon:      圖示
 *   groupType: 權限參數
 *   alterMsg:  顯示用訊息
 *   isFavorite:是否已經設為我的最愛
 *   position:  位置資訊
 * }
 * @throws Exception
 */
export const getFavoriteList = async () => {
  const response = await callAPI('/api/menu/favoriteFunc/v1/getAll');
  return response.data;
};
/**
 * (我的最愛)新增/更新已設定的項目清單
 * @param {
 *   actKey:    功能代碼
 *   position:  位置資訊
 *   otherDesc: 其他資訊 // TODO otherDesc尚未加入ORDS API中
 *   }
 * @returns {
 *   result:  true/false
 *   message: 回傳訊息
 *   actKey:  功能代碼
 *   }
 * @throws Exception
 * 已存在清單中的項目更新位置，沒有的項目則新增
 */
export const modifyFavoriteItem = async (request) => {
  const response = await callAPI('/api/menu/favoriteFunc/v1/modify', request);
  return response.data;
};
/**
* (我的最愛)移除清單中的項目
* @param actKey: 功能代碼
* @returns{
*     result:   true/false
*     message:  回傳訊息
*     actKey:   功能代碼
*   }
* ORDS API的刪除功能是用 [actKey=null + position的值] 來判斷要刪除的功能，這API轉成前端直接傳actKey來指定刪除的功能
* @throws Exception
*/
export const deleteFavoriteItem = async (request) => {
  const response = await callAPI('/api/menu/favoriteFunc/v1/remove', request);
  return response.data;
};
