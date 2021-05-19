import userAxios from 'apis/axiosConfig';

export const init = async () => {
  const response = await userAxios
    .get('/api/billPay')
    .then((data) => data)
    .catch((err) => err);
  return response.data;
};

export const pay = () => {

};
