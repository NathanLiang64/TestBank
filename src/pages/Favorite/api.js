import { callAPI } from 'utilities/axios';

/**
 * (我的最愛)取得提供設定的項目選單
 * @param JwtToken
 * @return{
 *   groupKey:
 *   groupName:
 *   items {
 *      actKey:
 *      name:
 *      url:
 *      icon:
 *      groupType:
 *      alterMsg:
 *      isFavorite:
 *      position:
 *   }
 * }
 * @throws Exception
 */
export const getFavoriteSettingList = async () => {
  const response = await callAPI('/api/menu/v1/favFuncList/getSetting');
  return response.data;
};
/**
 * (我的最愛)取得已設定的項目清單(最多12個)
 * @param JwtToken
 * @return{
 *   actKey:
 *   name:
 *   url:
 *   icon:
 *   groupType:
 *   alterMsg:
 *   isFavorite:
 *   position:
 * }
 * @throws Exception
 */
export const getFavoriteList = async () => {
  const response = await callAPI('/api/menu/v1/favFuncList/getAll');
  return response.data;
};
/**
 * (我的最愛)新增/更新已設定的項目清單
 * @param JwtToken
 * @param {
 *   actKey:"A03",
 *   position: 8,
 *   otherDesc: "1000"
 *   }
 * @returns {
 *   result: "true/false"
 *   message:""
 *   actKey: "D00100"
 *   }
 * @throws Exception
 * 已存在清單中的項目更新位置，沒有的項目則新增
 * TODO: otherDesc尚未加入ORDS API中
 */
export const modifyFavoriteItem = async (request) => {
  const response = await callAPI('/api/menu/v1/favFuncList/modify', request);
  return response.data;
};
/**
* (我的最愛)刪除清單中的項目
*
* @param JwtToken
* @param actKey: "D00100"
* @returns{
*     result: "true/false"
*     message:""
*     actKey: "D00100"
*   }
* ORDS API的刪除功能是用 [actKey=null + position的值] 來判斷要刪除的功能，這API轉成前端直接傳actKey來指定刪除的功能
* @throws Exception
*/
export const deleteFavoriteItem = async (request) => {
  const response = await callAPI('/api/menu/v1/favFuncList/delete', request);
  return response.data;
};
