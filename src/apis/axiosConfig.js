/* eslint-disable no-alert */
import axios from 'axios';
import Cookies from 'js-cookie';
import JWTUtil from '../utilities/JWTUtil';
import { showWebLog, switchLoading } from '../utilities/BankeePlus';
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
    console.log(config);
    switchLoading(true);
    const jwt = Cookies.get('jwtToken');
    if (jwt) {
      const aeskey = localStorage.getItem('aesKey');
      const ivkey = localStorage.getItem('iv');
      showWebLog('jwtToken', jwt);
      console.log('jwtToken', jwt);
      showWebLog('aeskey', aeskey);
      console.log('aeskey', aeskey);
      showWebLog('ivkey', ivkey);
      console.log('ivkey', ivkey);
      config.data.bindingUdid = '48c3d54d-bab3-471a-9778-2c98a157c3f80199263632160019';
      config.headers.authorization = `Bearer ${jwt}`;
      showWebLog('beforeEncrypt', config.data);
      console.log('beforeEncrypt', config.data);
      // 加密
      const encrypt = JWTUtil.encryptJWTMessage(aeskey, ivkey, JSON.stringify(config.data));
      config.data = encrypt;
      showWebLog('afterEncrypt', config.data);
      console.log('afterEncrypt', config.data);
    }
    showWebLog('RequestData', config.data);
    return config;
  },
  (error) => Promise.reject(error),
);

userAxios().interceptors.response.use(
  async (response) => {
    switchLoading(false);
    const token = Cookies.get('jwtToken');
    if (token) {
      const aeskey = localStorage.getItem('aesKey');
      const ivkey = localStorage.getItem('iv');
      // 解密
      // const encrypt = JWTUtil.decryptJWTMessage(aeskey, ivkey, response.data);
      const { jwtToken } = response.data;
      if (jwtToken) {
        Cookies.set('jwtToken', jwtToken);
      }
      if (response.config.url === '/auth/login') {
        return response.data;
      }
      showWebLog('Response', response.data);
      if (response.data.code === '0000') {
        const decrypt = JWTUtil.decryptJWTMessage(aeskey, ivkey, response.data);
        response = decrypt;
      } else {
        response = response.data;
      }
    }
    return response;
  },
  // eslint-disable-next-line consistent-return
  (error) => {
    switchLoading(false);
    const { response } = error;
    showWebLog('Response Error', error);
    alert(JSON.stringify(error));
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

const userRequest = (method, url, data = {}) => {
  method = method.toLowerCase();
  switch (method) {
    case 'get':
      return userAxios().get(url, { params: data });
    case 'post':
      return userAxios().post(url, data);
    case 'put':
      return userAxios().put(url, data);
    case 'patch':
      return userAxios().patch(url, data);
    case 'delete':
      return userAxios().delete(url, { params: data });
    default:
      // eslint-disable-next-line no-console
      console.log(`未知的 method: ${method}`);
      return false;
  }
};

// const getStorageData = (keyName) => {
//   const value = localStorage.getItem(keyName);
//   return value || null;
// };

export default userAxios();
export { userRequest };
