import userAxios from './axiosConfig';

// 訊息通知 - 查詢推播通知項目
export const getNoticeItem = async (param) => {
  const response = await userAxios
    .post('/api/setting/queryNoticeItem', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};

// 訊息通知 - 查詢推播通知訊息列表
export const getNotices = async (param) => {
  const response = await userAxios
    .post('/api/setting/queryPush', param)
    .then((data) => data)
    .catch((err) => err);
  return response;
};
