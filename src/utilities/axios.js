import axios from 'axios';
import { showPrompt, showError, showInfo } from './MessageModal';
import JWTUtil from './JWTUtil';

// Axios instance
const instance = axios.create({
  baseURL: process.env.REACT_APP_URL,
});

const userAxios = () => {
  if (process.env.NODE_ENV === 'production') {
    return instance;
  }
  // 本機測試時，一定要直接使用使用 axios，否則會有跨網域問題。
  return axios;
};

userAxios().defaults.retry = 3;
userAxios().defaults.retryDelay = 1000;
userAxios().interceptors.request.use(
  async (request) => {
    console.log(`\x1b[33mAPI :/${request.url}`);
    console.log('Request = ', request.data);
    const token = sessionStorage.getItem('jwtToken'); // BUG! 會因為多執行緒而錯亂，應該從Request中取回才對。
    if (token) {
      // eslint-disable-next-line no-param-reassign
      request.headers.authorization = `Bearer ${token}`;
      if (request.data) {
        // Request Payload 加密
        const aeskey = sessionStorage.getItem('aesKey');
        const ivkey = sessionStorage.getItem('iv');
        const encrypt = JWTUtil.encryptJWTMessage(aeskey, ivkey, JSON.stringify(request.data));
        request.data = encrypt;
      } else request.data = '{}';
    }
    // console.log(`%cRequest --> ${JSON.stringify(request)}`, 'color: Green;'); // 列出完整的 Request 資訊。
    return request;
  },
  (ex) => {
    // 系統層錯誤！
    // 若是環境問題，則直接顯示；若是WebController未處理的錯誤，則另外處理。
    console.log(`%cRequest Error --> ${JSON.stringify(ex)}`, 'color: Red;');

    Promise.reject(ex);
  },
);

userAxios().interceptors.response.use(
  async (response) => {
    // console.log(`%cResponse --> \n%c${JSON.stringify(response)}`, 'color: Yellow;', 'color: Green;');
    // console.log(`jwtToken=${response.data.jwtToken}`);
    let rqJwtToken; // 來查是否發出的Request有沒有加密
    // const jwtToken = sessionStorage.getItem('jwtToken'); // BUG! 會因為多執行緒而錯亂，應該從Request中取回才對。
    const headerAuth = response.config.headers.authorization; // 取出Request時所使用的 jwtToken
    if (headerAuth && headerAuth.startsWith('Bearer ')) {
      // eslint-disable-next-line prefer-destructuring
      rqJwtToken = headerAuth.split(' ')[1];

      // 不論成功或失敗，都一定會更新 jwtToken
      const renewJwtToken = response.data.jwtToken;
      sessionStorage.setItem('jwtToken', renewJwtToken); // BUG! 會因為多執行緒而錯亂
      // TODO: 更新計時器
    }

    // 解密
    // 若Request時沒有使用jwtToken，或例外發生時，傳回的資料都不會加密。
    if (response.data.code === '0000' && rqJwtToken) {
      const aeskey = sessionStorage.getItem('aesKey');
      const ivkey = sessionStorage.getItem('iv');
      const decrypt = JWTUtil.decryptJWTMessage(aeskey, ivkey, response.data);
      response.data.data = decrypt;
      // console.log(`Response Data(解密後) --> ${JSON.stringify(response.data)}`);
    }

    if (response.data.code !== '0000') {
      // TODO: 導向API失敗的例外處理的頁面！
    }

    console.log(`\x1b[33m${response.config.url} \x1b[37m - Response = \n`, response);

    // 傳回 未加密 或 解密後 的資料
    return response;
  },
  (ex) => {
    // 系統層錯誤！
    // 若是環境問題，則直接顯示；若是WebController未處理的錯誤，則另外處理。
    console.log(`%cResponse Error --> ${JSON.stringify(ex)}`, 'color: Red;');
    const { response } = ex;
    if (response) {
      console.log(`%cResponse Error --> ${JSON.stringify(response)}`, 'color: Red;');
      console.error(response.data);
      // TODO: Hold住畫面，再 Reload 一次。
      showError(`主機忙碌中，請通知客服人員或稍後再試。訊息代碼：(${response.status})`);
    }
    return Promise.reject(ex);

    /*
    // 成功發出 request 但沒收到 response
    if (!window.navigator.onLine) {
      // TODO : 。。。
    }
    // 其它問題，例如跨域或程式問題
    return Promise.reject(ex);
    */
  },
);

/**
 *
 * @param {*} method 目前只支援 post/get
 * @param {*} url 透過 setupProxy.js 定義轉接 API 名稱。
 * @param {*} data
 * @param {*} config AxiosRequestConfig
 * @returns
 */
const userRequest = async (method, url, data = {}, config) => {
  method = method.toLowerCase();
  let result = null;
  switch (method) {
    case 'get':
      result = await userAxios().get(url, { params: data }, config);
      break;

    case 'post':
      result = await userAxios().post(url, data, config);
      break;

    // case 'put':
    //   return userAxios().put(url, data, config);
    // case 'patch':
    //   return userAxios().patch(url, data, config);
    // case 'delete':
    //   return userAxios().delete(url, { params: data }, config);
    default:
      console.log(`未支援的 method: ${method}`);
      result = null;
      break;
  }
  return result;
};

/**
 * 透過 axios 叫用指定的 API，並負責處理非正常的傳回狀態。
 * @param {*} url 透過 setupProxy.js 定義轉接 API 名稱。
 * @param {*} request
 * @param {*} config AxiosRequestConfig
 * @returns 將 WebController 提供的結果傳回；當發生異常時，將傳回 null
 */
export const callAPI = async (url, request, config) => {
  let response = null;
  await userRequest('post', url, request, config)
    .then(async (rs) => {
      // 只需傳回 WebController 傳回的部份，其他由 axios 額外附加的屬性則不傳回。
      const { code, message } = rs.data;
      if (code === 'OK') {
        response = rs.data.data;
        return;
      }

      switch (code) {
        case 'APLFX9999':
          await showError(message, () => {
            document.location.href = `${process.env.REACT_APP_CARD_SELECT_URL}`;
          });
          break;

        case 'APLFX1402': // JWT Expired
          await showPrompt('您已閒置過久，為了保護個資的安全，我們必需重新建立與主機的連線。');
          break;

        default:
          await showInfo(message);
          break;
      }
    })
    .catch((rs) => {
      console.log('catch: {}', rs);
    })
    // eslint-disable-next-line no-unused-vars
    .finally((rs) => {
      // console.log('finally: {}', rs);
    });

  return { data: response };
};

export default userAxios();
export { userRequest };
