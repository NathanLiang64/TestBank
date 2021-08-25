import userAxios from './axiosConfig';

// 變更網銀密碼
export const changePwd = async (param) => {
  const response = await userAxios
    .post('/api/setting/modifyPwd', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};
