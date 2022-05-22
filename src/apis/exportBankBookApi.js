import userAxios from './axiosConfig';

// email 發送數位存摺
export const sendBankBookMail = async (param) => {
  const response = await userAxios
    .post('/api/deposit/v1/sendAcctTxDtl', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};
