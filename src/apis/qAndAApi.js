import userAxios from './axiosConfig';

const getTabs = (apiUrl) => (
  userAxios.get(apiUrl)
    .then((response) => response.data)
    .catch((error) => error.response)
);

export {
  getTabs,
};
