import userAxios from './axiosConfig';

// 優惠利率額度 - 取得優惠利率年月
export const getBonusPeriodList = async (params) => (
  await userAxios.post('/api/depositPlus/getDepBonusPeriodList', params)
    .then((response) => response)
    .catch((error) => error)
);

// 優惠利率額度 - 取得優惠利率年月 (優惠利率額度等級表)
export const getDepositPlusLevelList = async (params) => (
  await userAxios.post('/api/depositPlus/getDepPlusByYear', params)
    .then((response) => response)
    .catch((error) => error)
);

// 優惠利率額度 - 取得優惠利率明細 (該月份優惠利率)
export const getDepositPlus = async (params) => (
  await userAxios.post('/api/depositPlus/getDepositPlus', params)
    .then((response) => response)
    .catch((error) => error)
);
