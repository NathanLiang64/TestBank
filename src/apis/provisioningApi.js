import userAxios from './axiosConfig';

// 開通 APP - 開通行動銀行服務
export const openhb = async (param) => {
  const response = await userAxios
    .post('/api/setting/openhb', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};
