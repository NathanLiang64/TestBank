import userAxios from './axiosConfig';

// 取得使用者暱稱 done
export const getNickName = async (param) => {
  const response = await userAxios
    .post('/api/setting/member/getInfo', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};

// 更新使用者暱稱 done
export const updateNickName = async (param) => {
  const response = await userAxios
    .post('/api/setting/member/updateInfo', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};

// 上傳 avatar
export const uploadAvatar = async (param) => {
  const response = await userAxios
    .post(
      '/api/setting/member/uploadImagePF',
      param,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    .then((data) => data)
    .catch((err) => err);
  return response;
};
