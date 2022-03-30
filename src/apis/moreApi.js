import userAxios from './axiosConfig';

// 取得更多功能清單
export const getMoreList = async (params = {}) => (
  await userAxios.post('/api/menu/getFunctionList', params)
    .then((response) => response)
    .catch((error) => error)
);
