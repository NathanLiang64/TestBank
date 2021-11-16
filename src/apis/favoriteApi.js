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
