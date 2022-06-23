/* eslint-disable no-bitwise */
/* eslint-disable object-curly-newline */
/* eslint-disable no-use-before-define */
/* eslint-disable brace-style */
/* eslint-disable prefer-template */
import {
  createTransactionAuth,
  transactionAuthVerify,
} from 'proto/forAppApi';
import e2ee from './E2ee';
import { customPopup, showError } from './MessageModal';

const device = {
  ios: () => /iPhone|iPad|iPod/i.test(navigator.userAgent),
  android: () => /Android/i.test(navigator.userAgent),
};

/**
 * 執行 APP 提供的 JavaScript（ jstoapp ）
 * @param {*} appJsName APP提供的JavaScript funciton名稱。
 * @param {*} jsParams JavaScript的執行參數。
 * @param {*} webDevTest Web開發測試時的執行方法。(Option)
 * @returns
 */
async function callAppJavaScript(appJsName, jsParams, webDevTest) {
  console.log(`\x1b[33mAPP-JS://${appJsName} \x1b[37m - Params = `, jsParams);
  const promise = new Promise((resolve) => {
    window.AppJavaScriptCallbackPromiseResolve = resolve;
    const request = {
      ...jsParams,
      callback: 'AppJavaScriptCallback', // 此方法可提供所有WebView共用。
    };

    if (device.ios()) {
      const msg = JSON.stringify({ name: appJsName, data: JSON.stringify(request) });
      window.webkit?.messageHandlers.jstoapp.postMessage(msg); // TODO 無效的 appJsName 的處理
    }
    else if (device.android()) {
      const androidParam = JSON.stringify(request);
      // eslint-disable-next-line no-eval
      eval('window.jstoapp?.' + appJsName)(androidParam); // TODO 無效的 appJsName 的處理
    }
    else if (webDevTest) {
      window.AppJavaScriptCallback(webDevTest(request));
    }
    else throw new Error('使用 Web 版未支援的 APP JavaScript 模擬方法(' + appJsName + ')');
  });

  // result 是由 AppJavaScriptCallback 接收，並嘗試用 JSON Parse 轉為物件，轉不成功則以原資料內容傳回。
  const result = await promise;
  console.log(`\x1b[33mAPP-JS://${appJsName} \x1b[37m - Result = `, result);
  return result;
}

/**
 * Web版 Function Controller
 */
const funcStack = {
  push: (data) => {
    const startItem = JSON.parse(data);
    console.log('Start Function : ', startItem);

    const stack = JSON.parse(localStorage.getItem('funcStack') ?? '[]');
    stack.push(startItem);
    localStorage.setItem('funcStack', JSON.stringify(stack));

    // 寫入 Function 啟動參數。
    localStorage.setItem('funcParams', startItem.funcParams);
  },
  pop: () => {
    const stack = JSON.parse(localStorage.getItem('funcStack') ?? '[]');
    const closedItem = stack[stack.length - 1];
    // console.log('POP -> Closed Item : ', closedItem);

    stack.pop();
    localStorage.setItem('funcStack', JSON.stringify(stack));

    const startItem = stack[stack.length - 1];
    if (startItem) {
      // 寫入 Function 啟動參數。
      const params = closedItem.keepData ?? startItem.funcParams;
      localStorage.setItem('funcParams', params);
      console.log('Close Function and Back to (', startItem.func, ')', params);
    } else {
      localStorage.removeItem('funcParams');
    }
    return startItem;
  },
  peek: () => {
    const stack = JSON.parse(localStorage.getItem('funcStack') ?? '[]');
    const lastItem = stack[stack.length - 1];
    return lastItem;
  },
  clear: () => {
    localStorage.setItem('funcStack', '[]');
  },
};

/**
 * 網頁通知APP跳轉至首頁
 */
async function goHome() {
  await callAppJavaScript('goHome', null, () => {
    funcStack.clear();
    startFunc('/');
  });
}

/**
 * 網頁通知APP跳轉指定功能
 * @param {*} funcID 單元功能代碼。
 * @param {*} funcParams 提共給啟動的單元功能的參數，被啟動的單元功能是透過 loadFuncParams() 取回。
 * @param {*} keepData 當啟動的單元功能結束後，返回原功能啟動時取回的資料。
 */
async function startFunc(funcID, funcParams, keepData) {
  if (!funcID) {
    showError('此功能尚未完成！');
    return;
  }

  // TODO: 若 funcID 是以'/'為開頭，表示是指定固定網址，因此不會交由 APP切換

  const data = JSON.stringify({
    funcID,
    funcParams: JSON.stringify(funcParams),
    keepData: JSON.stringify(keepData),
  });
  await callAppJavaScript('startFunc', data, () => {
    funcID = funcID.replace(/^\/*/, ''); // 移掉前置的 '/' 符號
    funcStack.push(data);
    window.location.pathname = `${process.env.REACT_APP_ROUTER_BASE}/${funcID}`;
  });
}

/**
 * 觸發APP返回上一頁功能
 */
async function closeFunc() {
  await callAppJavaScript('closeFunc', null, () => {
    const funcItem = funcStack.pop();
    const rootPath = `${process.env.REACT_APP_ROUTER_BASE}/`;
    if (funcItem) {
      window.location.pathname = `${rootPath}${funcItem.func}`; // keepData 存入 localStorage 'funcParams'
    } else {
      window.location.pathname = rootPath;
    }
  });
}

/**
 * 取得 APP Function Controller 提供的功能啟動參數。
 * @returns 若參數當時是以 JSON 物件儲存，則同樣會轉成物件傳回。
 */
async function loadFuncParams() {
  let data = await callAppJavaScript('getPagedata', null, () => 'localStorage');
  if (data && data !== 'undefined') {
    try {
      let params = null;
      if (data === 'localStorage') {
        data = localStorage.getItem('funcParams');
        params = JSON.parse(data);
      } else {
        // 解析由 APP 傳回的資料, 只要有 keepData 就表示是由叫用的功能結束返回
        // 因此，要以 keepData 為單元功能的啟動參數。
        // 反之，表示是單元功能被啟動，此時才是以 funcParams 為單元功能的啟動參數。
        params = data.keepData ?? data.funcParams;
      }

      console.log('>> Function 啟動參數 : ', params);
      return params;
    } catch (error) {
      console.log(error);
    }
  }

  return null;
}

/**
 * 開啟/關閉APP Loading等待畫面
 * @param {boolean} visible
 */
async function switchLoading(visible) {
  const data = { open: visible ? 'Y' : 'N' };
  await callAppJavaScript('onLoading', data);
}

/**
 * 啟動APP OCR畫面及識別流程, APP在處理結束後會呼叫callback Web JS將傳給網頁
 * @param {*} imageType 影像類型。1.身份證正面, 2.身份證反面
 * @returns 辨識結果。例：{"rtcode":"", "rtmsg":"","data":[{"type":"name","data":"林宜美"},{"type":"birthday","data":"69/5/20"},{"type":"sex","data":"女"}]}
 */
async function doOCR(imageType) {
  const data = { ocrType: imageType };
  return await callAppJavaScript('onOCR', data);
}

/**
 * 以 Popup 模式開啟 APP 原生的 WebView，不會影響到目前運做中的 WebView。
 * 注意：Page間的資料傳遞與傳回值的取得，需由 Page 自行處理。
 * @param {*} url 要開啟的畫面連結
 */
async function showPopup(url) {
  const data = { url };
  await callAppJavaScript('openPopWebView', data, () => {
    // TODO 用 MessageModal 的 customPopup 模擬。
  });
}

/**
 * 開啟 APP 分享功能。
 * @param {*} message 要分享的訊息內容，內容為 HTML 格式。
 */
async function shareMessage(message) {
  const data = { webtext: message };
  await callAppJavaScript('setShareText', data, () => {
    // 測試版的分享功能。
    customPopup('分享功能 (測試版)', message);
  });
}

// Note setWebLogdata 用不到

// TODO 提供 Exception 資訊給 APP 寫入回報，就有需要了。

// ??? webvie 通知APP取得安全資料
// ??? 用途為何？
async function getEnCrydata() {
  return await callAppJavaScript('getEnCrydata');
}

/**
 * 通知 APP 同步 WebView 的 JwtToken
 * @param {*} jwtToken WebView 最新取得的 JwtToken
 */
async function syncJwtToken(jwtToken) {
  sessionStorage.setItem('jwtToken', jwtToken);

  const data = { auth: jwtToken };
  await callAppJavaScript('setAuthdata', data, () => null);
}

/**
 * 取得 JwtToken。
 * 為保持 Token 的連續性，因此必須優先使用 Web 端的 Token；因為 APP 端有可能因為背景功能發動API而更新了 Token。
 * @param {boolean} force 表示強制使用 APP 端的 JwtToken
 * @returns 最新的 JwtToken
 */
async function getJwtToken(force) {
  const jwtToken = sessionStorage.getItem('jwtToken');
  if (jwtToken && !force) return jwtToken;

  const result = await callAppJavaScript('getAPPAuthdata', null, () => null); // 傳回值： {"auth":""}
  console.log(`\x1b[32m[JWT] \x1b[92m${result.auth}`);
  sessionStorage.setItem('jwtToken', result.auth);
  return result.auth; // NOTE 不應該為 null, 不論是 result 或 auth。
}

// NOTE onVerification 不符合需求

/**
 * 由 APP 發起交易驗證功能，包含輸入網銀帳密、生物辨識、OTP...。
 * @param {*} authCode 要求進行的驗證模式的代碼。
 * @param {*} otpMobile 簡訊識別碼發送的手機門號。當綁定或變更門號時，因為需要確認手機號碼的正確性，所以要再驗OTP
 * @returns {
 *   result: 驗證結果(true/false)。
 *   message: 驗證失敗狀況描述。
 * }
 */
const transactionAuthPromiseResolve = null; // 提供 APP Callback 時，結束Promise使用！
async function transactionAuth(authCode, otpMobile) {
  const data = {
    authCode,
    otpMobile,
  };
  return await callAppJavaScript('transactionAuth', data, appTransactionAuth);
}

/**
 * 負責接收 APP JavaScript API callback 的方法。
 * @param {*} result APP JavaScript API的傳回值。
 */
// eslint-disable-next-line no-unused-vars
function transactionAuthCallback(result) {
  console.log('*** OTP Result from APP : ', result);
  // localStorage.setItem('appJsResponse', result.data); // 將 APP 傳回的資料寫回。
  transactionAuthPromiseResolve(result);
}

/**
 * 模擬 APP 要求使用者進行交易授權驗證。
 * @param request {
 *   authCode: 要求進行的驗證模式的代碼。
 *   otpMobile: 簡訊識別碼發送的手機門號。當綁定或變更門號時，因為需要確認手機號碼的正確性，所以要再驗OTP
 *   callback: { 要求進行驗證的來源 JavaScript 提供的 Callback JavaScript
 *     result: 驗證結果(true/false)
 *     message: 驗證失敗狀況描述。
 *   }
 * }
 */
async function appTransactionAuth(request) {
  const { authCode, otpMobile, callback } = request;

  // 取得目前執行中的單元功能代碼，要求 Controller 發送或驗出時，皆需提供此參數。
  const funcCode = funcStack.peek()?.func ?? '/'; // 首頁因為沒有功能代碼，所以用'/'表示。

  const loginMode = 21; // TODO 取得登入模式：0.未登入, 1.訪客登入, 11.快速登入, 21.帳密登入
  const boundMID = false; // TODO 取得 MID 的綁定狀態。

  // 檢查是否可用生物辨識或圖形鎖驗證。
  let allowed2FA = ((loginMode === 11 || loginMode === 21) && ((authCode & 0x20) !== 0)); // 表示可以使用 生物辨識或圖形鎖 通過驗證。

  const failTimes = 0; // TODO 若三次不通過，則改為使用網銀密碼驗證！
  allowed2FA = allowed2FA && (failTimes < 3);

  // 檢查是否需輸入網銀密碼（只要有 2FA 的功能，就不用輸入密碼；只有在三次驗不過之後，才切換到用密碼驗證）
  const allowedPWD = (!allowed2FA && (loginMode === 21) && (authCode & 0x1F) !== 0); // 表示可以使用 網銀密碼或OTP或(網銀密碼+OTP) 通過驗證。
  const inputPwd = (allowedPWD && (authCode & 0x10)); // 表示需要輸入網銀密碼

  // NOTE 沒有 boundMID，但又限定只能使用 2FA 時；傳回 false 尚未進行行動裝置綁定，無法使用此功能！
  if (allowedPWD === false && boundMID === false) {
    await showError('尚未完成行動裝置綁定，無法使用此功能！');
    return;
  }

  // 建立交易授權驗證。
  const otpMode = (authCode & 0x0F);
  const sendOtp = (allowedPWD && otpMode !== 0) || ((otpMode & 0x03) === 0x03); // 表示需要發送OTP
  const txnAuth = await createTransactionAuth({ // 傳回值包含發送簡訊的手機門號及簡訊識別碼。
    funcCode,
    authCode: authCode + 0x96c1fc6b98e00, // TODO 這個 HashCode 要由 Controller 在 Login 的 Response 傳回。
    otpMobile,
  });
  if (!txnAuth) return; // createTransactionAuth 發生異常就結束。

  // Web測試版。
  const body = (
    <div>
      {/* 驗證生物辨識或圖形鎖驗證 */}
      {(allowed2FA && failTimes < 3) ? (
        <div>
          <p>《 驗證生物辨識或圖形鎖驗證 》</p>
          <input type="text" id="auth2FA" />
          <br />
          <p>輸入 xxx 表示驗證失敗！</p>
          <p>TODO 若三次不通過，則改為使用網銀密碼驗證！</p>
          <br />
        </div>
      ) : null}

      {/* 驗證OTP */}
      {sendOtp ? (
        <div>
          <p>{`發送門號：${txnAuth.otpMobile}`}</p>
          <p>{`OTP識別碼：${txnAuth.otpSmsId}`}</p>
          <p>輸入驗證碼</p>
          <input type="text" id="otpCode" defaultValue={txnAuth.otpCode} />
          <br />
        </div>
      ) : null}

      {/* 驗證網銀密碼 */}
      {inputPwd ? (
        <div>
          <p>輸入網銀密碼</p>
          <input type="text" id="netbankPwd" defaultValue="feib1688" />
          <br />
        </div>
      ) : null}
    </div>
  );

  // eslint-disable-next-line no-eval
  const cbfunc = eval(callback);

  // 驗證 OTP Code 是否正確。
  const onOk = async () => {
    // TODO 2FA驗證模式應該自動驗證，不需要使用者按OK；一旦驗證通過，則自動關閉視窗，並傳回結果。
    const auth2FA = document.querySelector('#auth2FA')?.value; // 可以讓Server端確認真的通過驗證的資料，例：全景的驗證資料

    // 驗證 OTP驗證碼 & 網銀密碼
    const otpCode = document.querySelector('#otpCode')?.value; // 使用者輸入的「驗證碼」。
    const netbankPwd = e2ee(document.querySelector('#netbankPwd')?.value); // 使用者輸入的「網銀密碼」，還要再做 E2EE。
    const verifyRs = await transactionAuthVerify({ authKey: txnAuth.key, funcCode, auth2FA, netbankPwd, otpCode });
    if (!verifyRs) return false; // createTransactionAuth 發生異常就結束。
    if (verifyRs.result === true) {
      cbfunc({
        result: true, // 正常結果。
        message: null,
      });
    } else {
      await showError(verifyRs.message);
      return false;
    }
    return verifyRs.result;
  };

  // 表示使用者取消。
  const onCancel = () => cbfunc({
    result: false,
    message: '使用者取消驗證。',
  });

  customPopup('交易授權驗證 (測試版)', body, onOk, onCancel);
}

export {
  goHome,
  startFunc,
  closeFunc,
  loadFuncParams,
  switchLoading,
  doOCR,
  showPopup,
  getEnCrydata,
  syncJwtToken,
  getJwtToken,
  transactionAuth,
  shareMessage,
};
