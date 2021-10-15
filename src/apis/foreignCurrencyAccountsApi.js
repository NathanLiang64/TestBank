import userAxios from './axiosConfig';

export const getForeignCurrencyAccounts = async () => (
  await userAxios.get('/api/getForeignCurrencyAccounts')
    .then((response) => response.data)
    .catch((error) => error)
);

export const getTransactionDetails = async () => (
  await userAxios.get('/api/getTransactionDetails')
    .then((response) => response.data)
    .catch((error) => error)
);
