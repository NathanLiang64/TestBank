import userAxios from 'apis/axiosConfig';
import axios from 'axios';

export const doGetInitData = (apiUrl) => (
  userAxios.get(apiUrl)
    .then((response) => response.data)
    .catch((error) => error.response)
);

export const getDetailsData = (apiUrl) => (
  axios.get(apiUrl)
    .then((response) => response.data)
    .catch((error) => error.response)
);
