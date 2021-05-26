import userAxios from 'apis/axiosConfig';

export const doGetInitData = (apiUrl) => (
  userAxios.get(apiUrl)
    .then((response) => response.data)
    .catch((error) => error.response)
);
