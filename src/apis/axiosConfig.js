import axios from 'axios';
import JWTUtil from '../utilities/JWTUtil';

// Request failed with status code
const errorHandle = (status, message) => {
  switch (status) {
    // 400: 未認證，或可能是帳號或密碼錯誤
    case 400:
      // eslint-disable-next-line no-console
      console.error(message);
      break;
    // 401: 登入失敗，可能是帳號或密碼錯誤
    case 401:
      // eslint-disable-next-line no-console
      console.error('連線逾時，請重新登入');
      setTimeout(() => {
        // 跳轉至登入頁
      }, 1000);
      break;
      // case 403:
      // case 404:
      // 其它錯誤

    default:
      // eslint-disable-next-line no-console
      console.error(`未攔截到的錯誤：${message}`);
  }
};

// Axios instance
const instance = axios.create({
  baseURL: process.env.REACT_APP_URL,
  // baseURL: process.env.WEBCtl_URL,
});

const userAxios = () => {
  if (process.env.NODE_ENV === 'production') {
    return instance;
  }
  // return axios;
  return instance;
};

userAxios().interceptors.request.use(
  (config) => {
    const jwt = localStorage.getItem('jwtToken');
    if (jwt) {
      config.headers.authorization = `Bearer ${jwt}`;
      const aeskey = localStorage.getItem('aesKey');
      const ivkey = localStorage.getItem('iv');
      // 加密
      const encrypt = JWTUtil.encryptJWTMessage(aeskey, ivkey, JSON.stringify(config.data));
      config.data = encrypt;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

userAxios().interceptors.response.use(
  (response) => {
    // const jwt = localStorage.getItem('jwtToken');
    // if (jwt) {
    //   const aeskey = localStorage.getItem('aesKey');
    //   const ivkey = localStorage.getItem('iv');
    //   // 加密
    //   const encrypt = JWTUtil.decryptJWTMessage(aeskey, ivkey, response.data);
    //   response = encrypt;
    // }
    // return response;
    console.log(response);
    const jwt = localStorage.getItem('jwtToken');
    if (jwt) {
      const aeskey = localStorage.getItem('aesKey');
      const ivkey = localStorage.getItem('iv');
      // 解密
      // const encrypt = JWTUtil.decryptJWTMessage(aeskey, ivkey, response.data);
      const decrypt = JWTUtil.decryptJWTMessage(aeskey, ivkey, response.encData);
      response = decrypt;
    }
    return response;
  },
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
      // eslint-disable-next-line no-console
      console.error('網路異常，請重新連線後再重新整理頁面');
    } else {
      // 其它問題，例如跨域或程式問題
      return Promise.reject(error);
    }
  },

);

export default userAxios();
