/* eslint-disable no-use-before-define */
/* eslint-disable brace-style */
/* eslint-disable prefer-template */
import { customPopup, showError } from './MessageModal';
import { sendOTP } from './api';

const device = {
  // TODO: 開發時使用，上版前應刪除！
  ios: () => false, // /iPhone|iPad|iPod/i.test(navigator.userAgent),
  android: () => false, // /Android/i.test(navigator.userAgent),
};

const funcStack = {
  push: (func, params = null, keepData = null) => {
    const startItem = {
      func, params, keepData,
    };
    console.log('Start Function : ', startItem);

    const stack = JSON.parse(localStorage.getItem('funcStack') ?? '[]');
    stack.push(startItem);
    localStorage.setItem('funcStack', JSON.stringify(stack));

    // 寫入 Function 啟動參數。
    localStorage.setItem('funcParams', JSON.stringify(params));
  },
  pop: () => {
    const stack = JSON.parse(localStorage.getItem('funcStack') ?? '[]');
    const closedItem = stack[stack.length - 1];
    console.log('POP -> Closed Item : ', closedItem);

    stack.pop();
    localStorage.setItem('funcStack', JSON.stringify(stack));

    const startItem = stack[stack.length - 1];
    if (startItem) {
      // 寫入 Function 啟動參數。
      const params = closedItem.keepData ?? startItem.params;
      localStorage.setItem('funcParams', JSON.stringify(params));
      console.log('Close Function and Back to (', startItem.func, ')', params);
    } else localStorage.removeItem('funcParams');
    return startItem;
  },
  clear: () => {
    localStorage.setItem('funcStack', '[]');
  },
};

/**
 * 網頁通知APP跳轉至首頁
 */
function goHome() {
  if (device.ios()) {
    const msg = JSON.stringify({ name: 'goHome' });
    window.webkit?.messageHandlers.jstoapp.postMessage(msg);
  }
  else if (device.android()) {
    window.jstoapp.goHome();
  }
  else {
    funcStack.clear();
    startFunc('/');
  }
}

/**
 * 網頁通知APP跳轉指定功能
 * @param {*} funcID 單元功能代碼。
 * @param {*} funcParams 提共給啟動的單元功能的參數，被啟動的單元功能是透過 loadFuncParams() 取回。
 * @param {*} keepData 當啟動的單元功能結束後，返回原功能啟動時取回的資料。
 */
function startFunc(funcID, funcParams, keepData) {
  if (!funcID) {
    showError('此功能尚未完成！');
    return;
  }

  // TODO: 若 funcID 是以'/'為開頭，表示是指定固定網址，因此不會交由 APP切換

  const data = JSON.stringify({ funcID, funcParams, keepData });
  if (device.ios()) {
    const msg = JSON.stringify({ name: 'startFunc', data });
    window.webkit?.messageHandlers.jstoapp.postMessage(msg);
  }
  else if (device.android()) {
    window.jstoapp.startFunc(data);
  }
  else {
    funcID = funcID.replace(/^\/*/, ''); // 移掉前置的 '/' 符號
    funcStack.push(funcID, funcParams, keepData);
    window.location.pathname = `${process.env.REACT_APP_ROUTER_BASE}/${funcID}`;
  }
}

/**
 * 觸發APP返回上一頁功能
 */
function closeFunc() {
  if (device.ios()) {
    const msg = JSON.stringify({ name: 'closeFunc' });
    // TODO： 取回 keepData；若沒有提供，則應以 funcParams 傳回。
    window.webkit?.messageHandlers.jstoapp.postMessage(msg);
  }
  else if (device.android()) {
    // TODO： 取回 keepData；若沒有提供，則應以 funcParams 傳回。
    window.jstoapp.closeFunc();
  }
  else {
    const funcItem = funcStack.pop();
    const rootPath = `${process.env.REACT_APP_ROUTER_BASE}/`;
    if (funcItem) {
      window.location.pathname = `${rootPath}${funcItem.func}`; // keepData 存入 localStorage 'funcParams'
    } else {
      window.location.pathname = rootPath;
    }
  }
}

/**
 * 取得 APP Function Controller 提供的功能啟動參數。
 * @returns 若參數當時是以 JSON 物件儲存，則同樣會轉成物件傳回。
 */
function loadFuncParams() {
  const data = localStorage.getItem('funcParams');
  if (data && data !== 'undefined') {
    try {
      const params = JSON.parse(data);
      console.log('>> Function 啟動參數 : ', params);
      return params;
    } catch (error) {
      return data;
    }
  }
  return null;
}

// 開關 loading
function switchLoading(param) {
  const data = { open: param ? 'Y' : 'N' };
  if (device.ios()) {
    const msg = JSON.stringify({ name: 'onLoading', data: JSON.stringify(data) });
    window.webkit?.messageHandlers.jstoapp.postMessage(msg);
  }
  if (device.android()) {
    const androidParam = JSON.stringify(data);
    window.jstoapp.onLoading(androidParam);
  }
}

// webvie 通知APP取得安全資料
function getEnCrydata() {
  if (device.ios()) {
    const msg = JSON.stringify({ name: 'getEnCrydata' });
    window.webkit?.messageHandlers.jstoapp.postMessage(msg);
  }
  if (device.android()) {
    window.jstoapp.getEnCrydata();
  }
}

// 網頁通知APP取得功能參數
function getPagedata() {
  if (device.ios()) {
    const msg = JSON.stringify({ name: 'getPagedata' });
    window.webkit?.messageHandlers.jstoapp.postMessage(msg);
  }
  if (device.android()) {
    window.jstoapp?.getPagedata();
  }
}

// 網頁通知APP更新Authorization
function setAuthdata(jwtToken) {
  const data = { auth: jwtToken };
  if (device.ios()) {
    const msg = JSON.stringify({ name: 'setAuthdata', data: JSON.stringify(data) });
    window.webkit?.messageHandlers.jstoapp.postMessage(msg);
  }
  if (device.android()) {
    const androidParam = JSON.stringify(data);
    window.jstoapp?.setAuthdata(androidParam);
  }
}

// 傳 log 給 App
// function showWebLog(type = 'none', log) {
//   const data = { type, log };
//   console.log(data);
//   if (device.ios()) {
//     const msg = JSON.stringify({ name: 'showWebLog', data: JSON.stringify(data) });
//     window.webkit?.messageHandlers.jstoapp.postMessage(msg);
//   }
//   if (device.android()) {
//     const androidParam = JSON.stringify(data);
//     window.jstoapp?.showWebLog(androidParam);
//   }
// }

/**
 * 由 APP 發起交易驗證功能，包含輸入網銀帳密、生物辨識、OTP...。
 * @param {*} txnType 交易類型，例：設定類（通知設定、變更基本資料...）、交易類（轉帳、換匯）
 * @param {*} otpMode OTP模式(11/12/21/22)，十位數：1＝MBGW,2=APPGW、個位數：1=發送至非約轉門號, 2=發送至CIF門號
 */
async function transactionAuth(txnType, otpMode) {
  const data = { type: txnType, otpType: '2' };
  if (device.ios()) {
    const msg = JSON.stringify({ name: 'onVerification', data: JSON.stringify(data) });
    await window.webkit?.messageHandlers.jstoapp.postMessage(msg);
  }
  else if (device.android()) {
    const androidParam = JSON.stringify(data);
    await window.jstoapp?.onVerification(androidParam);
  }
  else {
    // 由 APP 發出 OTP，並將識別碼顯示於畫面，待 User 輸入驗證碼後。
    // Controller 將 OTP ID 存入 JwtToken
    // APP 將 User 輸入的驗證碼寫入 localStorege 再由 WebView 取回。
    await appSendOTP(otpMode, (result) => {
      localStorage.setItem('appJsResponse', result.data); // 將 APP 傳回的資料寫回。
    });
  }
}

/**
 * 模擬 APP 的 OTP 發送及要求使用者輸入 驗證碼
 * @param {*} otpMode OTP模式
 * @param {*} callback {
 *   code: 執行狀態。00.成功, 其他代碼分別表示不同 JS funciton 的失敗訊息。
 *   data: 執行結果。例：OTP驗證，則傳回使用者輸入的「驗證碼」。
 * }
 */
async function appSendOTP(otpMode, callback) {
  const apiRs = sendOTP(otpMode); // 不需提供其他參數

  // Web測試版。
  const body = (
    <div>
      <p>{`發送閘導：${Number.parseInt(otpMode / 10, 10) === 1 ? 'MBGW' : 'APPGW'}`}</p>
      <br />
      <p>{`發送門號：${(otpMode % 10) === 1 ? '非約轉門號' : 'CIF門號'}`}</p>
      <br />
      <p>{`OTP識別碼：${apiRs.otpCode}`}</p>
      <br />
      <p>輸入驗證碼</p>
      <input type="text" id="otpVerify" />
    </div>
  );
  const onOk = () => callback({
    code: '00', // 正常結果。
    data: document.querySelector('otpVerify'), // 使用者輸入的「驗證碼」。 // TODO 取得 輸入的驗證碼
  });
  const onCancel = () => callback({
    code: '01', // 表示使用者取消。
    data: null,
  });
  customPopup('OTP 驗證 (測試版)', body, onOk, onCancel);
}

/**
 * 開啟 APP 分享功能。
 * @param {*} message 要分享的訊息內容，內容為 HTML 格式。
 */
function shareMessage(message) {
  const data = JSON.stringify({
    name: 'setShareText',
    data: JSON.stringify({ webtext: message }),
  });

  if (device.ios()) {
    window.webkit.messageHandlers.jstoapp.postMessage(data);
  }
  else if (device.android()) {
    window.jstoapp.setShareText(data);
  }
  else {
    // 測試版的分享功能。
    customPopup('分享功能 (測試版)', message);
  }
}

export {
  goHome,
  startFunc,
  closeFunc,
  loadFuncParams,
  switchLoading,
  getEnCrydata,
  getPagedata,
  setAuthdata,
  transactionAuth,
  shareMessage,
};
