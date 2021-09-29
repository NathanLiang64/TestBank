import userAxios from './axiosConfig';

// 取得職業別清單
export const getJobsCode = async (param) => {
  const response = await userAxios
    .post('/api/setting/queryJobCode', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};

// 更新定期基本資料
export const modifyRegularBasicInformation = async (param) => {
  const response = await userAxios
    .post('/api/setting/custMdfyJob', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};
