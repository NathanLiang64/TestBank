import userAxios from './axiosConfig';

// 取得縣市鄉鎮清單
export const getCountyList = async (param) => {
  const response = await userAxios
    .post('/api/setting/queryCounty', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};
