import userAxios from './axiosConfig';

// 取得金融百貨清單
export const getFinanceStore = async (param) => {
  const response = await userAxios
    .post('/api/menu/getFinanceStore', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};
