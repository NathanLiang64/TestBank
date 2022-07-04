import { callAPI } from 'utilities/axios';

// 取得常見問題主類別 done
export const getQACategory = async (param) => {
  const response = await callAPI('/api/setting/queryQACat', param);
  return response;
};

// 取得常見問題子類別 done
export const getQASubCategory = async (param) => {
  const response = await callAPI('/api/setting/queryQASubCat', param);
  return response;
};
