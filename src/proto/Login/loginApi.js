import userAxios from 'apis/axiosConfig';

export const userLogin = async (data) => {
  const response = await userAxios
    .post('/auth/login', data)
    .then((responseData) => responseData)
    .catch((err) => err);
  return response;
};

export const pay = () => {

};
