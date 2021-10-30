import userAxios from './axiosConfig';

// 我的最愛 - 取得我的最愛清單 (mock api)
// export const getFavoriteList = async () => (
//   await userAxios.get('/api/getFavoriteList')
//     .then((response) => response.data)
//     .catch((error) => error)
// );

// 我的最愛 - 取得我的最愛清單
export const getFavoriteList = async (params = {}) => (
  await userAxios.post('/api/menu/favorite/query', params)
    .then((response) => response)
    .catch((error) => error)
);

export const getFavoriteSettings = async (params = {}) => (
  await userAxios.post('/api/menu/favorite/setting', params)
    .then((response) => response)
    .catch((error) => error)
);
