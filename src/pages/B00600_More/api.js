import { callAPI } from 'utilities/axios';

/**
 * 取得更多功能清單
 * @returns [{
 *   groupKey: 分類代碼
 *   groupName: 功能分類(群組)名稱
 *   items: [{
 *     actKey: 功能代碼
 *     alterMsg: null
 *     groupType: null
 *     icon: 圖示名稱。若為 null，則表示使用預設值；否則將從 網站 img 區取得。 // TODO 還沒規劃目錄
 *     name: 功能名稱
 *   }, ...]
 * }, ...]
 */
export const getMoreList = async () => {
  const response = await callAPI('/function/v1/getFunctionList');
  return response.data;
};
