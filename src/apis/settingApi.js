import userAxios, { userRequest } from './axiosConfig';

// 取得縣市鄉鎮清單
export const getCountyList = async (param) => {
  const response = await userAxios
    .post('/api/setting/queryCounty', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};

// 取得 OTP 及 MOTP 開通狀態
export const getMotpStatus = (params) => (
  userRequest('post', '/api/setting/motp/status', params)
);
