import userAxios from 'apis/axiosConfig';

// 取得頁面資訊
export const doGetPageInfo = async (apiUrl) => (
  userAxios.get(apiUrl)
    .then((response) => response.data)
    .catch((error) => error.response)
);
