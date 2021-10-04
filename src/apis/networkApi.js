import userAxios from './axiosConfig';

export const getNetworkUserInfo = async () => (
  await userAxios.get('/api/getNetworkUserInfo')
    .then((response) => response.data)
    .catch((error) => error)
);

export const getNetworkOverview = async () => (
  await userAxios.get('/api/getNetworkOverview')
    .then((response) => response.data)
    .catch((error) => error)
);

export const getNetworkFeedback = async () => (
  await userAxios.get('/api/getNetworkFeedback')
    .then((response) => response.data)
    .catch((error) => error)
);
