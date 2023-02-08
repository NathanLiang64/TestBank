import { callAPI } from 'utilities/axios';
import { Func } from 'utilities/FuncID';

/**
 * 取得所有單元功能清單。
 * @returns {Promise<{
 *   groupKey: String, // 群組代碼
 *   groupName: String, // 群組名稱
 *   items: [{
 *     funcCode: String, // 功能代碼
 *     name: String, // 功能名稱
 *     icon: String, // 圖示名稱。若為 null，則表示使用預設值；否則將從 網站 img 區取得。 // TODO 還沒規劃目錄
 *     hidden: Boolean, // 表示隱藏，通常用在申請類功能。
 *   }] // 單元功能清單
 * }>}
 */
export const getMoreList = async () => {
  const response = await callAPI('/function/v1/getFunctionList');
  const groups = response.data;

  // 取得擁有的產品代碼清單，例：[M, F, S, C, CC, L]
  const assetTypes = sessionStorage.getItem('assetTypes')?.split(',');

  // 設定所有功能的 hidden 旗標。
  groups.forEach((grp) => {
    grp.items.forEach((func) => {
      const funcInfo = Func.find(func.funcCode);
      if (funcInfo) {
        func.hidden = assetTypes?.includes(funcInfo.hidden);
      } else {
        console.log('* Error : ORDS 傳回未定義的功能 => ', func);
      }
    });
  });

  return groups;
};
