// import { history } from '../index';

/* eslint-disable prefer-template */
const device = {
  ios: () => /iPhone|iPad|iPod/i.test(navigator.userAgent),
  android: () => /Android/i.test(navigator.userAgent),
};

const funcStack = {
  push: (func, params, keepData, hideMenu) => {
    const stack = JSON.parse(localStorage.getItem('funcStack') ?? '[]');
    stack.push({
      func, params, keepData, hideMenu,
    });
    localStorage.setItem('funcStack', JSON.stringify(stack));
  },
  pop: () => {
    const stack = JSON.parse(localStorage.getItem('funcStack') ?? '[]');
    stack.pop();
    localStorage.setItem('funcStack', JSON.stringify(stack));
    return stack;
  },
  clear: () => {
    localStorage.setItem('funcStack', '[]');
  },
};

// 網頁通知APP跳轉指定功能
function goToFunc({ route, funcID }, funcParams = '', keepData = '') {
  console.log(navigator.userAgent);
  // console.debug('name:' + funcName + ', data:' + jsonParams);
  route = route.replace('/', '');
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
    console.log(`[Start Function(${funcID})]`);
    funcStack.push({ route, funcID }, funcParams, keepData);
    // console.log(history);
    // const history = useHistory();
    // history.push(`/${funcID}`);
    window.location.pathname = `/${route}`;
  }
}

// 觸發APP返回上一頁功能
function closeFunc() {
  if (device.ios()) {
    const msg = JSON.stringify({ name: 'closeFunc' });
    window.webkit?.messageHandlers.jstoapp.postMessage(msg);
  } else if (device.android()) {
    window.jstoapp.closeFunc();
  } else {
    const stack = funcStack.pop();
    const funcItem = stack[stack.length - 1];
    if (funcItem) {
      console.log(`[Close Function and Back to(${funcItem.func.route})]`);
      window.location.pathname = `/${funcItem.func.route}`;
      // const history = useHistory();
      // history.push(funcItem.funcName);
    } else {
      window.location.pathname = '/';
    }
  }
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
  goToFunc({ route: '/', funcID: 'home' });
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
function showWebLog(type = 'none', log) {
  const data = { type, log };
  if (device.ios()) {
    const msg = JSON.stringify({ name: 'showWebLog', data: JSON.stringify(data) });
    window.webkit?.messageHandlers.jstoapp.postMessage(msg);
  }
  if (device.android()) {
    const androidParam = JSON.stringify(data);
    window.jstoapp?.showWebLog(androidParam);
  }
}

export {
  goToFunc,
  closeFunc,
  goHome,
  switchLoading,
  getEnCrydata,
  goAppHome,
  getPagedata,
  setAuthdata,
  showWebLog,
};
