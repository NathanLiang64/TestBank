import userAxios from './axiosConfig';

// 取得縣市清單
export const getCountyList = async (param) => {
  const response = await userAxios
    .get('/api/getCountyList', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};

// 取得鄉鎮市區清單
export const getDistrict = async (param) => {
  const response = await userAxios
    .get('/api/getDistrict', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};

// 取得個人基本資料
export const getBasicInformation = async (param) => {
  const response = await userAxios
    .post('/api/setting/custQuery', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};

// 更新個人基本資料
export const modifyBasicInformation = async (param) => {
  const response = await userAxios
    .post('/api/setting/custModify', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};