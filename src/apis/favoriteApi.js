import { userRequest } from './axiosConfig';

// 我的最愛 - 取得我的最愛清單 (mock api)
// export const getFavoriteList = async () => (
//   await userAxios.get('/api/getFavoriteList')
//     .then((response) => response.data)
//     .catch((error) => error)
// );

/**
 * 我的最愛 - 取得我的最愛清單
 * @returns 我的最愛清單
    [{
        "actKey":"B00200",
        "name":"推薦碼分享",
        "url":null,
        "icon":"imageZ01",
        "groupType":null,
        "alterMsg":"系統功能(開發中)",
        "isFavorite":null,
        "position":"-1"
    },...]
 */
export const getFavoriteList = (params) => (
  userRequest('post', '/api/menu/favorite/query', params)
);
/**
 *  取得我的最愛設定選項
 * @returns 設定選項清單
    {
        "groupKey":"A",
        "groupName":"帳戶服務",
        "items":[{
            "actKey":"C00100",
            "name":"帳戶總覽",
            "url":null,
            "icon":"imageA01.png",
            "groupType":null,
            "alterMsg":"功能開發中",
            "isFavorite":"0",
            "position":null
          },
          { "actKey":"C00300",
            "name":"台幣活存",
            "url":null,
            "icon": "imageA02.png",
            "groupType":null,
            "alterMsg":"功能開發中",
            "isFavorite":"0",
            "position":null
          },...]
    }
 */
export const getFavoriteSettings = (params) => (
  userRequest('post', '/api/menu/favorite/setting', params)
);
/**
 * 更新我的最愛項目 (編輯/刪除)
 * 編輯: 已存在項目更新位置，沒有的項目則新增
  * @param  {
      "actKey":"A03",
      "position": 8,
    }
  * 刪除:
    {
        "actKey":null,
        "position": 8,
    }
    * @returns "更新成功"
 */
export const updateFavoriteItem = (params) => (
  userRequest('post', '/api/menu/favorite/update', params)
);
