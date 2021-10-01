import userAxios from 'apis/axiosConfig';

export const doGetInitData = (apiUrl) => (

  userAxios.get(apiUrl)
    .then((response) => response.data)
    .catch((error) => error.response)
);

export const getBankCode = async (params) => (
  await userAxios.post('/api/transfer/queryBank', params)
    .then((response) => response)
    .catch((error) => error)
);

export const getNtdTrAcct = async (params) => (
  await userAxios.post('/api/transfer/queryNtdTrAcct', params)
    .then((response) => {
      console.log(response);
      return response;
    })
    .catch((error) => error)
);
