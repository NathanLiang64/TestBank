import userAxios from 'apis/axiosConfig';

export const getE2EEFlag = async () => {
  const response = await userAxios
    .get('/api/getE2EEFLAG')
    .then((data) => data)
    .catch((err) => err);
  return response.data;
};

export const pay = () => {

};
