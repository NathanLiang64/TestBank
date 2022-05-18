/* eslint-disable no-use-before-define */
/* eslint-disable brace-style */
/* eslint-disable prefer-template */
import { showError } from './MessageModal';

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
      window.location.pathname = `${rootPath}${funcItem.func.route}`; // keepData 存入 localStorage 'funcParams'
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

// 向 APP 請求 OTP 驗證
function onVerification() {
  const data = { type: '1', otpType: '2' };
  if (device.ios()) {
    const msg = JSON.stringify({ name: 'onVerification', data: JSON.stringify(data) });
    window.webkit?.messageHandlers.jstoapp.postMessage(msg);
  }
  if (device.android()) {
    const androidParam = JSON.stringify(data);
    window.jstoapp?.onVerification(androidParam);
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
  onVerification,
};
