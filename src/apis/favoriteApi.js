import userAxios from './axiosConfig';

export const getCustomFavoriteList = async () => (
  await userAxios.get('/api/getCustomFavoriteList')
    .then((response) => response.data)
    .catch((error) => error)
);

export const getFavoriteList = async () => (
  await userAxios.get('/api/getFavoriteList')
    .then((response) => response.data)
    .catch((error) => error)
);
