import axios from 'axios';

// Request failed with status code
const errorHandle = (status, message) => {
  switch (status) {
    // 400: 未認證，或可能是帳號或密碼錯誤
    case 400:
      console.error(message);
      break;
    // 401: 登入失敗，可能是帳號或密碼錯誤
    case 401:
      console.error('連線逾時，請重新登入');
      setTimeout(() => {
        // 跳轉至登入頁
      }, 1000);
      break;
      // case 403:
      // case 404:
      // 其它錯誤

    default:
      console.log(`未攔截到的錯誤：${message}`);
  }
};

// Axios instance
const instance = axios.create({
  baseURL: process.env.REACT_APP_URL,
});

// request interceptors
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtKey');
    if (token) {
      // eslint-disable-next-line no-param-reassign
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// response interceptors
instance.interceptors.response.use(
  (response) => response,
  // eslint-disable-next-line consistent-return
  (error) => {
    const { response } = error;

    if (response) {
      // 成功發出 request 且收到 response，但有 error
      errorHandle(response.status, response.data.error);
      return Promise.reject(error);
    }
    // 成功發出 request 但沒收到 response
    if (!window.navigator.onLine) {
      // 如果是網路連線問題
      console.error('網路異常，請重新連線後再重新整理頁面');
    } else {
      // 其它問題，例如跨域或程式問題
      return Promise.reject(error);
    }
  },
);

const userAxios = () => {
  if (process.env.NODE_ENV === 'production') {
    return instance;
  }
  return axios;
};

export default userAxios();
