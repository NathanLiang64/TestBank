import userAxios from './axiosConfig';

// 變更使用者代號
export const changeUserName = async (param) => {
  const response = await userAxios
    .post('/setting/changeUserName', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};
