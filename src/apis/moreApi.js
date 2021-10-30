import userAxios from './axiosConfig';

// 優惠利率額度 - 取得優惠利率年月
export const getMoreList = async (params = {}) => (
  await userAxios.post('/api/menu/getFunctionList', params)
    .then((response) => response)
    .catch((error) => error)
);
