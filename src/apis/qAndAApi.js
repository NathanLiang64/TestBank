import userAxios from './axiosConfig';

// 取得常見問題主類別
export const getQACategory = async (param) => {
  const response = await userAxios
    .post('/api/setting/queryQACat', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};

// 取得常見問題子類別
export const getQASubCategory = async (param) => {
  const response = await userAxios
    .post('/api/setting/queryQASubCat', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};
