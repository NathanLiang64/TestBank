import { callAPI } from 'utilities/axios';

// 取得職業別清單
export const fetchJobsCode = async (param) => {
  const response = await callAPI('/api/setting/queryJobCode', param);
  return response;
};

// 更新定期基本資料
export const updateRegularBasicInformation = async (param) => {
  const response = await callAPI('/api/setting/custMdfyJob', param);
  return response;
};
