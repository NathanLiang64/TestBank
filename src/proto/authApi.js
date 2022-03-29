import userAxios from './axiosConfig';

// 登出
export const logout = async (param) => {
  const response = await userAxios
    .post('/auth/logout', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};
