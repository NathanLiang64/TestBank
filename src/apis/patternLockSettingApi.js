import userAxios from './axiosConfig';

export const init = async () => {
  const response = await userAxios
    .get('/api/patternLockSetting')
    .then((data) => data)
    .catch((err) => err);
  return response.data;
};

export const other = async () => {
  const response = await userAxios
    .get('/api/patternLockSetting')
    .then((data) => data)
    .catch((err) => err);
  return response.data;
};
