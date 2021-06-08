import userAxios from './axiosConfig';

export const getTabs = (apiUrl) => (
  userAxios.get(apiUrl)
    .then((response) => response.data)
    .catch((error) => error.response)
);
