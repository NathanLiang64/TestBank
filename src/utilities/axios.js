/* eslint-disable no-use-before-define */
/* eslint-disable brace-style */
import axios from 'axios';
import Cookies from 'js-cookie';
import { showError } from './MessageModal';
import JWEUtil from './JWEUtil';
import JWTUtil from './JWTUtil';
import { getJwtToken, syncJwtToken } from './AppScriptProxy';

// Axios instance
const instance = axios.create({
  baseURL: process.env.REACT_APP_URL,
});

const userAxios = () => instance;

/**
 * processRequest
 * @param {*} request
 * @returns
 */
const processRequest = async (request) => {
  console.log(`\x1b[33mAPI : ${request.method.toUpperCase()} /${request.url}`);
  console.log('Request = ', request.data);
  if (request.method === 'get') return request;

  const payload = JSON.stringify(request.data);

  const jwtToken = await getJwtToken();
  if (jwtToken) request.headers.authorization = `Bearer ${jwtToken}`;

  // 處理 JWE Request 加密；在完成 Login 之前，都是使用 JWE 加密模式。
  if (request.url.startsWith('/sm')) {
    if (request.url.startsWith('/smJwe/')) { // TODO request.url.startsWith('//auth/')
      const serverPKey = sessionStorage.getItem('serverPKey');
      request.data = JWEUtil.encryptJWEMessage(serverPKey, payload);
    }

    request.url = request.url.replace('/smApi/', '/api/');
    request.url = request.url.replace('/smJwe/', '/api/');
  }
  // 處理 JWT Request 加密；當通過 Login 驗證之後，所有 POST 全部都是使用 JWT 加密模式。
  else if (jwtToken) {
    const aeskey = sessionStorage.getItem('aesKey');
    const ivkey = sessionStorage.getItem('iv');
    request.data = JWTUtil.encryptJWTMessage(aeskey, ivkey, payload);
  }
  // console.log(`%cRequest --> ${JSON.stringify(request)}`, 'color: Green;'); // 列出完整的 Request 資訊。
  return request;
};

/**
 * processResponse
 * @param {*} response
 * @returns
 */
const processResponse = async (response) => {
  // console.log(`%cResponse --> \n%c${JSON.stringify(response)}`, 'color: Yellow;', 'color: Green;');
  // console.log(`jwtToken=${response.data.jwtToken}`);
  // eslint-disable-next-line object-curly-newline
  const { code, data, mac, jwtToken } = response.data; // 不論成功或失敗，都一定會更新 jwtToken

  let rqJwtToken; // 來查是否發出的Request有沒有加密
  const headerAuth = response.config.headers.authorization; // 用Request時所使用的 jwtToken 來判斷是否有使用 JWT
  if (headerAuth && headerAuth.startsWith('Bearer ')) {
    // eslint-disable-next-line prefer-destructuring
    rqJwtToken = headerAuth.split(' ')[1];

    // console.log(`\x1b[32m[New JWT] \x1b[92m${jwtToken}`);
    if (!jwtToken) console.log(`\x1b[31m*** WARNING *** ${response.config.url} 將 JWT Token 設為空值！`, response);
    else {
      await syncJwtToken(jwtToken); // BUG! 可能因為多執行緒而錯亂
      Cookies.set('jwtToken', jwtToken); // TODO: 為了相容 axiosConfig
    }
  }

  const encData = data ?? response.data.encData; // 為相容 SM
  if (code === '0000') {
    let resultData;
    // 處理 JWE Response 解密
    if (encData.recipients) { // TODO 暫時用這種方式檢查 JWE
      console.log('*** Start JWE Decode ***');
      const privateKey = sessionStorage.getItem('privateKey');
      resultData = JSON.parse(JWEUtil.decryptJWEMessage(privateKey, encData));
    }
    // 處理 JWT Response 解密；若Request時沒有使用jwtToken，或例外發生時，傳回的資料都不會加密。
    else if (rqJwtToken) {
      // console.log('*** Start JWT Decode ***');
      const aeskey = sessionStorage.getItem('aesKey');
      const ivkey = sessionStorage.getItem('iv');
      // console.log(aeskey, ivkey, encData);
      resultData = JWTUtil.decryptJWTMessage(aeskey, ivkey, encData, mac);
    }

    // console.log(`Response Data(解密後) --> ${JSON.stringify(resultData)}`);
    if (resultData) {
      response.data = {
        code,
        data: resultData,
        message: response.data.message,
      };
    }
  }

  if (code !== '0000') {
    const { message } = response.data;
    // TODO: 導向API失敗的例外處理的頁面！
    console.log(`\x1b[31m${response.config.url} - Exception = (\x1b[33m${code}\x1b[31m) ${message}`);
    if (code === 'ISG0001') {
      await showError('因為您已閒置過久未操作系統，為考量資訊安全；銀行端已自動切斷您的連線。若您要繼續使用，請重新登入，造成您的不便敬請見諒。'); // TODO , () => closeFunc());
    } else {
      // eslint-disable-next-line react/jsx-one-expression-per-line
      await showError((<p>*** {code} ***<br />{message}</p>));
    }
    return Promise.reject(code);
  }

  console.log(`\x1b[33m${response.config.url} \x1b[37m - Response = `, response.data);

  // 傳回 未加密 或 解密後 的資料
  return response;
};

instance.defaults.retry = 3;
instance.defaults.retryDelay = 1000;
// instance.defaults.maxContentLength = Infinity;
// instance.defaults.maxBodyLength = Infinity;
instance.interceptors.request.use(
  processRequest,
  (ex) => {
    // 系統層錯誤！
    // 若是環境問題，則直接顯示；若是WebController未處理的錯誤，則另外處理。
    console.log('\x1b[31mRequest Error --> ', ex);
    Promise.reject(ex);
  },
);
instance.interceptors.response.use(
  processResponse,
  async (ex) => {
    // 系統層錯誤！
    // 若是環境問題，則直接顯示；若是WebController未處理的錯誤，則另外處理。
    console.log(`%cResponse Error --> ${JSON.stringify(ex)}`, 'color: Red;');
    const { response } = ex;
    if (response) {
      console.log(`%cResponse Error --> ${JSON.stringify(response)}`, 'color: Red;');
      console.error(response.data);
      // TODO: Hold住畫面，再 Reload 一次。
      await showError(`主機忙碌中，請通知客服人員或稍後再試。訊息代碼：(${response.status})`); // TODO: 目前沒有 status 這個值。
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
  instance.defaults.baseURL = (url.startsWith('/sm')) ? process.env.REACT_APP_SM_CTRL_URL : process.env.REACT_APP_URL;
  // console.log(instance.defaults.baseURL + url);

  method = method.toLowerCase();
  let result = null;
  switch (method) {
    case 'get':
      result = await instance.get(url, { params: data }, config);
      break;

    case 'post':
      result = await instance.post(url, data, config);
      break;

    // case 'put':
    //   return instance.put(url, data, config);
    // case 'patch':
    //   return instance.patch(url, data, config);
    // case 'delete':
    //   return instance.delete(url, { params: data }, config);
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
      if (code === '0000') {
        response = rs.data;
      } else {
        switch (code) {
          case 'WEBCTL1006':
            await showError(message, () => {
              document.location.href = `${process.env.REACT_APP_ROUTER_BASE}/login`;
            });
            break;

          default:
            await showError(message);
            break;
        }
      }
    })
    .catch((err) => {
      response = err;
    });
  // // eslint-disable-next-line no-unused-vars
  // .finally((rs) => {
  //   // console.log('finally: {}', rs);
  // });

  return response;
};

/**
 * 下載檔案。
 * @param {*} url POST API URL
 * @param {*} request
 * @param {*} filename 輸出檔名。
 * @param {*} contentType
 */
const download = async (url, request, filename, contentType) => {
  console.log(`\x1b[33mAPI :/${url}`);
  console.log('Request = ', request);
  const token = await getJwtToken();

  // Request Payload 加密
  const aeskey = sessionStorage.getItem('aesKey');
  const ivkey = sessionStorage.getItem('iv');
  const encrypt = JWTUtil.encryptJWTMessage(aeskey, ivkey, JSON.stringify(request));

  fetch(url, {
    method: 'POST',
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      'Content-Type': contentType,
    }),
    body: JSON.stringify(encrypt),
  }).then((response) => response.blob())
    .then((file) => {
      console.log(file);
      const fileUrl = URL.createObjectURL(file);

      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = filename;
      a.click();
    })
    .catch((e) => {
      console.log(e);
    });
};

/**
 * 下載 PDF 檔案。
 * @param {*} url POST API URL
 * @param {*} request
 * @param {*} filename 輸出檔名。
 */
export const downloadPDF = async (url, request, filename) => {
  download(url, request, filename, 'application/pdf');
};

/**
 * 下載 CSV 檔案。
 * @param {*} url POST API URL
 * @param {*} request
 * @param {*} filename 輸出檔名。
 */
export const downloadCSV = async (url, request, filename) => {
  download(url, request, filename, 'text/csv');
};

export default userAxios();
export { userRequest };
