/* eslint-disable no-bitwise */
/* eslint-disable no-use-before-define */
import forge from 'node-forge';
import store from 'stores/store';
import { setAllCacheData } from 'stores/reducers/CacheReducer';
import { callAppJavaScript } from 'hooks/useNavigation';
import { customPopup, showTxnAuth } from './MessageModal';
// eslint-disable-next-line import/no-cycle
import { callAPI } from './axios';

/**
 * 取得目前運行的作業系統代碼。
 * @param {Boolean} allowWebMode 表示傳回
 * @returns {Number} 1.iOS, 2.Android, 3.Web, 4.其他
 */
function getOsType(allowWebMode) {
  if (allowWebMode && !window.webkit && !window.jstoapp) return 3;

  if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) return 1;
  if (/Android/i.test(navigator.userAgent)) return 2;

  // 未知的平台
  return 4;
}

/**
 * 開啟/關閉APP Loading等待畫面
 * @param {Promise<boolean>} visible
 */
async function showWaitting(visible) {
  const data = { open: visible ? 'Y' : 'N' };
  await callAppJavaScript('onLoading', data, false);
}

/**
 * 啟動APP OCR畫面及識別流程, APP在處理結束後會呼叫callback Web JS將傳給網頁
 * @param {*} imageType 影像類型。1.身份證正面, 2.身份證反面
 * @returns 辨識結果。例：{"rtcode":"", "rtmsg":"","data":[{"type":"name","data":"林宜美"},{"type":"birthday","data":"69/5/20"},{"type":"sex","data":"女"}]}
 */
async function doOCR(imageType) {
  const data = { ocrType: imageType };
  return await callAppJavaScript('onOCR', data, true);
}

/**
 * 以 Popup 模式開啟 APP 原生的 WebView，不會影響到目前運做中的 WebView。
 * 注意：Page間的資料傳遞與傳回值的取得，需由 Page 自行處理。
 * @param {*} url 要開啟的畫面連結
 */
async function showPopup(url) {
  const data = { url };
  await callAppJavaScript('openPopWebView', data, false, () => {
    // TODO 用 MessageModal 的 customPopup 模擬。
  });
}

/**
 * 開啟原生的 Alert 視窗。
 * @param {*} message 要顯示的訊息。
 */
async function showAlert(message) {
  const data = { message };
  await callAppJavaScript('showAlert', data, false, () => {
    alert(message);
  });
}

/**
 * 開啟 APP 分享功能。
 * @param {*} message 要分享的訊息內容，內容為 HTML 格式。
 */
async function shareMessage(message) {
  const data = { webtext: message };
  await callAppJavaScript('setShareText', data, false, () => {
    // 測試版的分享功能。
    customPopup('分享功能 (測試版)', message);
  });
}

// TODO 提供 Exception 資訊給 APP 寫入回報，就有需要了。

/**
 * 取得 JWT Payload 加密用的 AES Key 及 IV
 * @returns
 */
async function getAesKey() {
  const aesKey = sessionStorage.getItem('aesKey');
  if (aesKey) {
    return {
      aesKey,
      iv: sessionStorage.getItem('iv'),
    };
  }
  const rs = await callAppJavaScript('getEnCrydata', null, true);
  return {
    aesKey: forge.util.decode64(rs.Crydata).substring(7),
    iv: forge.util.decode64(rs.Enivec).substring(7),
  };
}

/**
 * 通知 APP 同步 WebView 的 JwtToken
 * @param {*} jwtToken WebView 最新取得的 JwtToken
 */
async function syncJwtToken(jwtToken) {
  if (jwtToken) {
    sessionStorage.setItem('jwtToken', jwtToken);
  } else {
    sessionStorage.removeItem('jwtToken');
    console.log('\x1b[31m*** WARNING *** JWT Token 被設為空值！');
  }

  const data = { auth: jwtToken };
  await callAppJavaScript('setAuthdata', data, false);
}

/**
 * 取得 JwtToken。
 * 為保持 Token 的連續性，因此必須優先使用 Web 端的 Token；因為 APP 端有可能因為背景功能發動API而更新了 Token。
 * @param {boolean} force 表示強制使用 APP 端的 JwtToken
 * @returns 最新的 JwtToken
 */
async function getJwtToken(force) {
  let jwtToken = null;
  if (!jwtToken || force) {
    // 從 APP 取得 JWT Token，並存入 sessionStorage 給之後的 WebView 功能使用。
    const result = await callAppJavaScript('getAPPAuthdata', null, true); // 傳回值： {"auth":""}
    jwtToken = result?.auth;
    if (!jwtToken) {
      // NOTE 不應該為 null, 不論是 result 或 auth；所以，只要取不到 Token 就表示還沒有登入，立即登出。
      jwtToken = sessionStorage.getItem('jwtToken');
      if (!jwtToken) {
        await forceLogout(401, '尚未登入', true);
      }
    } else {
      sessionStorage.setItem('jwtToken', jwtToken); // 每次收到 Response 時，就會寫入 sessionStorage
    }
  }
  // console.log(`\x1b[32m[JWT] \x1b[92m${jwtToken}`);
  return jwtToken;
}

/**
 * 由 APP 發起交易驗證功能，包含輸入網銀帳密、生物辨識、OTP...。
 * @param {Number} authCode 要求進行的驗證模式的代碼。
 * @param {String?} otpMobile 簡訊識別碼發送的手機門號。當綁定或變更門號時，因為需要確認手機號碼的正確性，所以要再驗OTP
 * @returns {Promise<{
 *  result: '驗證結果。'
 *  message: '驗證失敗狀況描述。'
 *  netbankPwd: '因為之後叫用交易相關 API 時可能會需要用到，所以傳回 E2EE 加密後的密碼。'
 * }>}
 */
async function transactionAuth(authCode, otpMobile) {
  // const data = {
  //   authCode,
  //   otpMobile,
  // };
  // return await callAppJavaScript('transactionAuth', data, true, appTransactionAuth);

  // DEBUG 在 APP 還沒完成交易驗證之前，先用 Web版進行測試。

  const result = await showTxnAuth(authCode, otpMobile);
  return result;
}

/**
 * 進行雙因子驗證，最多進行三次；若都失敗 或是 使用者取消，則傳回 false。
 * @param {*} authKey 建立授權驗證時傳回的金鑰，用來檢核使用者輸入。
 * @returns {
 *   result: 驗證結果(true/false)。
 *   message: 驗證失敗或Exception狀況描述。
 *   exception: 若不是 null 或空字串，則表示有例外。
 * }
 */
async function verifyBio(authKey) {
  const data = {
    AuthKey: authKey,
  };
  const rs = await callAppJavaScript('chkQLfeature', data, true, async () => { // TODO APP-JS 增加傳回 exception！
    // DEBUG
    // 傳回：累計驗證次數；若為 -1 表示使用者取消。
    const apiRs = await callAPI('/security/v1/setBioResult', { authKey, success: true });
    return {
      result: apiRs.isSuccess ? (apiRs.data <= 3) : false,
      message: apiRs.message,
      exception: apiRs.isSuccess ? null : apiRs.code,
    };
  });

  if (rs.exception) throw new Error(rs.message);
  return rs;
}

/**
 * 查詢快速登入綁定狀態
 * @returns {Promise<{
 *  result: '驗證結果(true/false)。'
 *  message: '驗證失敗狀況描述。'
 *  QLStatus: '本裝置快速登入綁定狀態：(result為true時有值) 0：未綁定 1：已正常綁定 2：綁定但已鎖定 3：已在其它裝置綁定 4：本裝置已綁定其他帳號'
 *  QLType: '快登裝置綁定所使用驗證方式(正常綁定狀態有值) (type->1:生物辨識/2:圖形辨識)'
 * }>}
 */
async function getQLStatus() {
  const appRs = await callAppJavaScript('getQLStatus', null, true, async () => {
    const response = await callAPI('/auth/v1/quickLoginBoundInfo');
    const testData = response.data;
    return {
      result: true,
      QLStatus: `${testData.status}`,
      QLType: `${testData.boundType}`,
    };
  });

  return {
    ...appRs,
    QLStatus: parseInt(appRs.QLStatus, 10),
    QLType: parseInt(appRs.QLType, 10),
  };
}

/**
 * 通知 APP 依 authType 指定的類型要求使用者進行快登設定。
 * @param {*} authType 快登所使用驗證方式。(1. 生物辨識, 2.圖形辨識)
 * @returns {
 *  result: 驗證結果(true/false)。
 *  message: 驗證失敗狀況描述。
 * }
 */
async function createQuickLogin(authType) {
  const data = {
    QLtype: `${authType}`,
  };
  const appRs = await callAppJavaScript('regQLfeature', data, true, () => ({ result: true }));
  if (appRs.result === true) {
    const apiRs = await callAPI('/auth/quickLogin/v1/create', { authType });
    return {
      result: apiRs.isSuccess,
      message: apiRs.message,
    };
  }
  return appRs;
}

// TODO 應改由 Controller 來做，對 APP 只是「通知」。
/**
 * 綁定快登裝置
 * @param {*} authType 快登所使用驗證方式。(1. 生物辨識, 2.圖形辨識)
 * @param {*} pwdE2ee E2EE加密後的密碼
 * @returns {
 *  result: 驗證結果(true/false)。
 *  message: 驗證失敗狀況描述。
 * }
 */
async function verifyQuickLogin(authType, pwdE2ee) {
  const data = {
    QLtype: `${authType}`,
    pwdE2ee,
  };
  const appRs = await callAppJavaScript('regQL', data, true, () => ({ result: true }));
  if (appRs.result === true) {
    const apiRs = await callAPI('/auth/quickLogin/v1/bind');
    return {
      result: apiRs.isSuccess,
      message: apiRs.message,
    };
  }
  return appRs;
}

/**
 * 解除快登綁定
 * @returns {
 *  result: 驗證結果(true/false)。
 *  message: 驗證失敗狀況描述。
 * }
 */
async function removeQuickLogin() {
  const appRs = await callAppJavaScript('delQL', null, true, () => ({ result: true }));
  if (appRs.result === true) {
    const apiRs = await callAPI('/auth/quickLogin/v1/unbind');
    return {
      result: apiRs.isSuccess,
      message: apiRs.message,
    };
  }
  return appRs;
}

/**
 * 異動圖形辨識圖形資料
 * @returns {
 *  result: 驗證結果(true/false)。
 *  message: 驗證失敗狀況描述。
 * }
 */
async function changePattern() {
  return await callAppJavaScript('changePattern', null, true, () => ({
    result: true,
    message: '',
  }));
}

/**
 * 還原 APP 在關閉 WebView 之前所保存的 CacheReducer 中的資料。
 */
async function restoreCache() {
  if (!window.setCacheData) {
    window.setCacheData = () => {
      const data = store.getState()?.CacheReducer;
      const cacheData = JSON.stringify(data);
      return cacheData;
    };

    // Result = {result: true, strCachedata: "", message: ""}
    const appCache = await callAppJavaScript('getCacheData', null, true);
    if (appCache) {
      try {
        const cacheData = JSON.parse(appCache.strCachedata);
        store.dispatch(setAllCacheData(cacheData));
        return cacheData;
      } catch (ex) {
        console.log('**** getCacheData Excption : ', ex);
      }
    }
  }

  const data = store.getState()?.CacheReducer;
  return data;
}

/**
 * 將資料存入 APP 資料字典。
 * @param {String} key 要儲存資料的key值
 * @param {Object} value 要儲存資料key值所對應的value值
 * @returns {Promise<{
 *   result: Boolean,
 *   message: String,
 * }>} {
 *   result: 驗證結果(true/false)。
 *   message: 驗證失敗狀況描述。
 * }
 */
async function storeData(key, value) {
  const valueStr = JSON.stringify(value ?? null);
  return await callAppJavaScript('setStorageData', {key, value: valueStr}, true, () => {
    sessionStorage.setItem(key, valueStr);
    return {
      result: true,
      message: '',
    };
  });
}

/**
 * 從 APP 資料字典取回資料，但資料項目不會清除。
 * @param {String} key 要取出的資料key值
 * @param {Boolean} remove 表示在取出後將此筆資料從 APP 資料字典中刪除
 * @returns {Promise<{Object}>} 儲存在 APP 資料字典中的值。
 */
async function restoreData(key, remove) {
  const data = await callAppJavaScript('getStorageData', {key, remove}, true, () => {
    const value = sessionStorage.getItem(key);
    if (remove) sessionStorage.removeItem(key);

    return {
      value,
      result: true,
      message: '',
    };
  });

  if (data && data.result) {
    return JSON.parse(data.value ?? 'null');
  }
  return null;
}

/**
 * 查詢訊息通知綁定狀態
 * @returns {{PushBindStatus: boolean}} 狀態布林值
 */
async function queryPushBind() {
  return await callAppJavaScript('queryPushBind', null, true, () => {
    console.log('web 執行取得綁定狀態');
    return {
      PushBindStatus: true,
    };
  });
}

/**
 * 通知 APP 強制登出。
 * @param {String} reasonCode 登出原因代碼。
 * @param {String} message 登出原因。
 * @param {Boolean} autoStart
 * 通常只有在 Timeout 或嚴重錯誤時才會發生。
 */
async function forceLogout(reasonCode, message, autoStart) {
  await callAppJavaScript('logout', { reason: reasonCode, message }, false, () => {
    if (!(autoStart && window.location.pathname.startsWith('/login'))) {
      // NOTE 原本想做成，登入後直接回到原本 Timeout 時的功能；但因為沒有執行 assetSummary & assetSummaryValues
      //      而且目前也沒有使用情境，所以先不要用！
      // const funcId = funcStack.peek() ? funcStack.peek().funcID : window.location.pathname.substring(1);
      const search = ''; // funcId ? `/${funcId}` : ''; // 登入後立即啟動的功能。
      window.location.href = `${process.env.REACT_APP_ROUTER_BASE}/login${search}`;
    }
  });
}

/**
 * 更新訊息通知設定綁定狀態
 * @param {}
 */
async function updatePushBind() {
  await callAppJavaScript('updatePushBind', null, false);
}

/**
 * 透過原生撥電話
 * @param {{
 *  url: String
 * }}param // param: {url: 'tel:02xxxxxxxx'}
 */
async function dialTel(param) {
  await callAppJavaScript('actionDial', param, false, () => {
    // 測試版的撥電話功能。
    customPopup('撥電話功能 (測試版)', JSON.stringify(param));
  });
}

/**
 * 透過原生進行截圖
 */
async function screenShot() {
  await callAppJavaScript('webScreenShot', null, true);
}

export {
  getOsType,
  showWaitting,
  doOCR,
  showPopup,
  showAlert,
  getAesKey,
  syncJwtToken,
  getJwtToken,
  transactionAuth,
  verifyBio,
  shareMessage,
  getQLStatus,
  createQuickLogin,
  verifyQuickLogin,
  removeQuickLogin,
  changePattern,
  queryPushBind,
  updatePushBind,
  restoreCache,
  storeData,
  restoreData,
  forceLogout,
  dialTel,
  screenShot,
};
