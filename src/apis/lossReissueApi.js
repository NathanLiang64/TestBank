import userAxios from './axiosConfig';

/* eslint-disable import/prefer-default-export */
export const doGetInitData = (apiUrl) => (
  userAxios.get(apiUrl)
    .then((response) => response.data)
    .catch((error) => error.response)
);
