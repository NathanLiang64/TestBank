import { userRequest } from './axiosConfig';

// 我的最愛 - 取得我的最愛清單 (mock api)
// export const getFavoriteList = async () => (
//   await userAxios.get('/api/getFavoriteList')
//     .then((response) => response.data)
//     .catch((error) => error)
// );

// 我的最愛 - 取得我的最愛清單
export const getFavoriteList = (params) => (
  userRequest('post', '/api/menu/favorite/query', params)
);

// 取得我的最愛設定選項
export const getFavoriteSettings = (params) => (
  userRequest('post', '/api/menu/favorite/setting', params)
);

// 更新我的最愛項目 (編輯/刪除)
export const updateFavoriteItem = (params) => (
  userRequest('post', '/api/menu/favorite/update', params)
);

// const test = () => {
//   const params = {
//     actKey: 'A01',
//     position: "1"
//   };
//   updateFavoriteItem(params)
//     .then((res) => console.log('編輯最愛 res', res))
//     .catch((err) => console.log('編輯最愛 err', err))
// }

// {
//   (id) "actKey": "Z01",
//   (label) "name": "推薦碼分享",
//   "url": null,
//   "icon": "imageZ01",
//   "groupType": null,
//   "alterMsg": "功能開發中",
//   "isFavorite": null
// }

// {
//   "groupKey": "A",
//   "groupName": "202102",
//   "items": [
//     {
//       "actKey": "A01",
//       "name": "帳戶總覽",
//       "url": null,
//       "icon": "imageA01.png",
//       "groupType": null,
//       "alterMsg": "功能開發中",
//       "isFavorite": "1"
//     }
//   ]
// }
