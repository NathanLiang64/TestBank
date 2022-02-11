import userAxios from 'apis/axiosConfig';

// 查詢匯率行情
export const getExchangeRateInfo = async (param) => {
  const response = await userAxios
    .post('api/frgn/queryRrateInfo', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};

// 取得可交易幣別
export const getCcyList = async (param) => {
  const response = await userAxios
    .post('api/frgn/qserviceTrfiCcy', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};

// 取得外幣交易性質列表
export const getExchangePropertyList = async (param) => {
  const response = await userAxios
    .post('api/frgn/leglTypeQ', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};

// 取得台幣帳戶
export const getNtdAccountsList = async (param) => {
  const response = await userAxios
    .post('api/deposit/ntdAcctSummary', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};

// 取得外幣帳號
export const getFrgnAccoutsList = async (param) => {
  const response = await userAxios
    .post('api/frgn/frgnAcctSummary', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};

// 外幣換匯 N2F
export const exchangeNtoF = async (param) => {
  const response = await userAxios
    .post('api/frgn/exchN2f', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};

// 外幣換匯 F2N
export const exchangeFtoN = async (param) => {
  const response = await userAxios
    .post('api/frgn/exchF2n', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};
