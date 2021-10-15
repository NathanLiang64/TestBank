import userAxios from './axiosConfig';

// 我的最愛 - 取得我的最愛清單
export const getFavoriteList = async () => (
  await userAxios.get('/api/getFavoriteList')
    .then((response) => response.data)
    .catch((error) => error)
);
