import userAxios from './axiosConfig';

export const getFavoriteList = async () => (
  await userAxios.get('/api/getFavoriteList')
    .then((response) => response.data)
    .catch((error) => error)
);
