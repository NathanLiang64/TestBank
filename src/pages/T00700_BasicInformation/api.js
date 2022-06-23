import { callAPI } from 'utilities/axios';

// 取得縣市清單
export const getCountyList = async (param) => {
  const response = await callAPI('/api/setting/queryCounty', param);
  return response.data;
};

// 取得個人基本資料
export const getBasicInformation = async (param) => {
  const response = await callAPI('/api/setting/custQuery', param);
  return response.data;
};

// 更新個人基本資料
export const modifyBasicInformation = async (param) => {
  const response = await callAPI('/api/setting/custModify', param);
  return response.data;
};
