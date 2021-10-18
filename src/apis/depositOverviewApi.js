import userAxios from 'apis/axiosConfig';
import axios from 'axios';

export const doGetInitData = (apiUrl) => (
  userAxios.get(apiUrl)
    .then((response) => response.data)
    .catch((error) => error.response)
);

// 取得所有台幣帳號
export const getAccounts = async () => (
  await userAxios.get('/api/getAccounts')
    .then((response) => response.data)
    .catch((error) => error)
);

export const getDetailsData = (apiUrl) => (
  axios.get(apiUrl)
    .then((response) => response.data)
    .catch((error) => error.response)
);

// 取得當前所選帳號之交易明細
export const getTransactionDetails = async (data) => {
  const baseURL = 'https://appbankee-t.feib.com.tw/ords/db1';
  const {
    account = '', custom = '', beginDT = '', endDT = '', tranTP = '', month = '', startIndex = '', direct = '',
  } = data;

  const apiUrl = `
    ${baseURL}/acc/getAccTx?actno=${account}&beginDT=${beginDT}&endDT=${endDT}&tranTP=${tranTP}&textSH=${custom}&dataMonth=${month}&startIndex=${startIndex}&direct=${direct}
  `;

  return await axios.get(apiUrl)
    .then((response) => response.data)
    .catch((error) => error);
};
