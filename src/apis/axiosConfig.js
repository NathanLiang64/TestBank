import axios from 'axios';
import Cookies from 'js-cookie';
import JWTUtil from '../utilities/JWTUtil';
import { showWebLog, switchLoading, setAuthdata } from '../utilities/BankeePlus';
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

// action log
// eslint-disable-next-line no-unused-vars
const postActionLog = (func, log) => {
  const data = {
    function: func, log: JSON.stringify(log), custId: localStorage.getItem('custId'), source: 'WebView',
  };
  fetch(
    'https://appbankee-t.feib.com.tw/ords/db1/uat/sys/addLog',
    {
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
      method: 'POST',
    },
  );
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
    switchLoading(true);
    const jwt = Cookies.get('jwtToken');
    if (jwt) {
      const aeskey = localStorage.getItem('aesKey');
      const ivkey = localStorage.getItem('iv');
      showWebLog('jwtToken', jwt);
      showWebLog('aeskey', aeskey);
      showWebLog('ivkey', ivkey);
      config.headers.authorization = `Bearer ${jwt}`;
      // 判斷是否是上傳圖片
      if (config.url.includes('uploadImagePF')) {
        const jwtRq = JWTUtil.encryptJWTMessage(aeskey, ivkey, JSON.stringify({}));
        config.data.append('jwtRq', JSON.stringify(jwtRq));
      } else {
        config.data.bindingUdid = '48c3d54d-bab3-471a-9778-2c98a157c3f80199263632160019';
        showWebLog('beforeEncrypt', config.data);
        postActionLog(`request: ${config.url}`, config.data);
        // 加密
        config.data = JWTUtil.encryptJWTMessage(aeskey, ivkey, JSON.stringify(config.data));
      }
    }
    showWebLog('RequestData', config.data);
    return config;
  },
  (error) => {
    showWebLog('RequestError', error);
    return Promise.reject(error);
  },
);

userAxios().interceptors.response.use(
  async (response) => {
    const apiUrl = response.config.url;
    switchLoading(false);
    const token = Cookies.get('jwtToken');
    postActionLog(`response: ${apiUrl}`, '成功取得資料(status: 200)');
    if (token) {
      const aeskey = localStorage.getItem('aesKey');
      const ivkey = localStorage.getItem('iv');
      // 解密
      // const encrypt = JWTUtil.decryptJWTMessage(aeskey, ivkey, response.data);
      const { jwtToken } = response.data;
      if (jwtToken) {
        Cookies.set('jwtToken', jwtToken);
        setAuthdata(jwtToken);
      }
      if (response.config.url === '/auth/login') {
        return response.data;
      }
      showWebLog('Response', response.data);
      if (response.data.code === '0000') {
        const decrypt = JWTUtil.decryptJWTMessage(aeskey, ivkey, response.data);
        showWebLog('decryptData', decrypt);
        response = decrypt;
      } else {
        response = { code: response.data.code, message: response.data.message };
        showWebLog('errorResponse', response);
      }
      postActionLog(`response: ${apiUrl}`, response);
    } else {
      postActionLog(`response: ${apiUrl}`, '無jwt token');
    }
    return response;
  },
  // eslint-disable-next-line consistent-return
  (error) => {
    switchLoading(false);
    const { response } = error;
    showWebLog('Response Error', error);
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
