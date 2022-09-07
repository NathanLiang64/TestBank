import { callAPI } from 'utilities/axios';

// 優惠利率額度 - 取得優惠利率年月
export const getBonusPeriodList = async (params) => {
  const response = await callAPI('/api/depositPlus/getDepBonusPeriodList', params);
  return response.data;
};

// 優惠利率額度 - 取得優惠利率年月 (優惠利率額度等級表)
export const getDepositPlusLevelList = async (params) => {
  const response = await callAPI('/api/depositPlus/getDepPlusByYear', params);
  return response.data;
};

// 優惠利率額度 - 取得優惠利率明細 (該月份優惠利率)
export const getDepositPlus = async (params) => {
  const response = await callAPI('/api/depositPlus/getDepositPlus', params);
  return response.data;
};
