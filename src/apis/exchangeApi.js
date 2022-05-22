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

/**
 * 取得帳戶清單
 * @param {*} acctTypes 帳戶類型 M:母帳戶, S:證券戶, F:外幣帳戶, C:子帳戶
 * @returns [{
 *   account: 帳號,
 *   name: 帳戶名稱，若有暱稱則會優先用暱稱,
 *   transable: 已設約轉 或 同ID互轉,
 *   details: [{ // 外幣多幣別時有多筆
 *     balance: 帳戶餘額,
 *     currency: 幣別代碼,
 *   }, ...]
 * }, ...]
 */
export const getAccountsList = async (acctTypes) => {
  const response = await userAxios
    .post('api/deposit/v1/getAccounts', acctTypes)
    .then((data) => data)
    .catch((err) => err);
  return response;
};

// 外幣交易匯率取得
export const getRate = async (param) => {
  const response = await userAxios
    .post('api/frgn/rateGet', param)
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

// 查詢是否為行員
export const isEmployee = async (param) => {
  const response = await userAxios
    .post('api/queryFundGroup', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};
