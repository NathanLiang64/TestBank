import { callAPI } from 'utilities/axios';

export const init = async () => {
  const response = await callAPI('/api/billPay');
  return response.data;
};
