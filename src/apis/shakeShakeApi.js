import userAxios from 'apis/axiosConfig';

export const doGetShakeInitData = (apiUrl) => (
  userAxios.get(apiUrl)
    .then((response) => response.data)
    .catch((error) => error.response)
);
