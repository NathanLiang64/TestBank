import userAxios from './axiosConfig';

export const getTradingAccounts = async () => (
  await userAxios.get('/api/getTradingAccounts')
    .then((response) => response.data)
    .catch((error) => error)
);

export const getTransactionDetails = async () => (
  await userAxios.get('/api/getTransactionDetails')
    .then((response) => response.data)
    .catch((error) => error)
);
