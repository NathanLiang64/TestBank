/* eslint-disable prefer-template */
import Cookies from 'js-cookie';
import { showError } from './MessageModal';

const device = {
  ios: () => /iPhone|iPad|iPod/i.test(navigator.userAgent),
  android: () => /Android/i.test(navigator.userAgent),
};

const funcStack = {
  push: (func, params = null, keepData = null, hideMenu = false) => {
    const stack = JSON.parse(localStorage.getItem('funcStack') ?? '[]');
    stack.push({
      func, params, keepData, hideMenu,
    });
    localStorage.setItem('funcStack', JSON.stringify(stack));

    Cookies.set('funcParams', JSON.stringify(params));
  },
  pop: () => {
    const stack = JSON.parse(localStorage.getItem('funcStack') ?? '[]');
    stack.pop();
    localStorage.setItem('funcStack', JSON.stringify(stack));

    const item = stack[stack.length - 1];
    if (item) Cookies.set('funcParams', JSON.stringify(item.params));
    return item;
  },
  clear: () => {
    localStorage.setItem('funcStack', '[]');
  },
};

// 網頁通知APP跳轉指定功能
function goToFunc({ route, funcID }, funcParams, keepData) {
  // console.debug('name:' + funcName + ', data:' + jsonParams);
  const data = {
    funcID,
    funcParams,
    keepData,
  };
  if (device.ios()) {
    const msg = JSON.stringify({ name: 'startFunc', data: JSON.stringify(data) });
    window.webkit?.messageHandlers.jstoapp.postMessage(msg);
  } else if (device.android()) {
    const param = JSON.stringify(data);
    window.jstoapp.startFunc(param);
  } else {
    console.log(`[Start Function(${route}, ${funcID})]`);
    route = route.replace(/^\/?/, '');
    funcStack.push({ route, funcID }, funcParams, keepData);
    // console.log(history);
    // const history = useHistory();
    // history.push(`/${funcID}`);
    window.location.pathname = `${process.env.REACT_APP_ROUTER_BASE}/${route}`; // TODO: 提供 funcParams，如何提供？
  }
}

function startFunc(funcID, funcParams, keepData) {
  if (funcID) {
    goToFunc({ route: funcID, funcID }, funcParams, keepData);
  } else {
    showError('此功能尚未完成！');
  }
}

// 觸發APP返回上一頁功能
function closeFunc() {
  if (device.ios()) {
    const msg = JSON.stringify({ name: 'closeFunc' });
    // TODO： 取回 keepData；若沒有提供，則應以 funcParams 傳回。
    window.webkit?.messageHandlers.jstoapp.postMessage(msg);
  } else if (device.android()) {
    // TODO： 取回 keepData；若沒有提供，則應以 funcParams 傳回。
    window.jstoapp.closeFunc();
  } else {
    const funcItem = funcStack.pop();
    if (funcItem) {
      console.log(`[Close Function and Back to(${funcItem.func.route})]`);
      window.location.pathname = `${process.env.REACT_APP_ROUTER_BASE}/${funcItem.func.route}`; // TODO： 提供 keepData，如何提供？
      // const history = useHistory();
      // history.push(funcItem.funcName);
    } else {
      window.location.pathname = `${process.env.REACT_APP_ROUTER_BASE}/`;
    }
  }
}

/**
 * 取得 APP Function Controller 提供的功能啟動參數。
 * @returns 若參數當時是以 JSON 物件儲存，則同樣會轉成物件傳回。
 */
function loadFuncParams() {
  const data = Cookies.get('funcParams');
  if (data && data !== 'undefined') {
    try {
      const params = JSON.parse(data);
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

function goHome() {
  funcStack.clear();
  goToFunc({ route: '/', funcID: 'B00100' });
}

// 網頁通知APP跳轉至首頁
function goAppHome() {
  if (device.ios()) {
    const msg = JSON.stringify({ name: 'goHome' });
    window.webkit?.messageHandlers.jstoapp.postMessage(msg);
    return;
  }
  if (device.android()) {
    window.jstoapp.goHome();
    return;
  }
  goHome();
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
  const data = { type: '1' };
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
  startFunc,
  goToFunc,
  closeFunc,
  goHome,
  switchLoading,
  getEnCrydata,
  goAppHome,
  getPagedata,
  setAuthdata,
  // showWebLog,
  onVerification,
  loadFuncParams,
};
