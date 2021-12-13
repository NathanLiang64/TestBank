import { useHistory } from 'react-router';

/* eslint-disable prefer-template */
const device = {
  ios: () => /iPhone|iPad|iPod/i.test(navigator.userAgent),
  android: () => /Android/i.test(navigator.userAgent),
};

const funcStack = {
  push: (code, params, keepData, hideMenu) => {
    const stack = JSON.parse(localStorage.getItem('funcStack') ?? '[]');
    stack.push({
      code, params, keepData, hideMenu,
    });
    localStorage.setItem('funcStack', JSON.stringify(stack));
  },
  pop: () => {
    const stack = JSON.parse(localStorage.getItem('funcStack') ?? '[]');
    const funcItem = stack.pop();
    localStorage.setItem('funcStack', JSON.stringify(stack));
    return funcItem;
  },
  clear: () => {
    localStorage.setItem('funcStack', '[]');
  },
};

function goToFunc(funcName, jsonParams = null) {
  console.log(navigator.userAgent);
  // console.debug('name:' + funcName + ', data:' + jsonParams);
  if (device.ios()) {
    const msg = JSON.stringify({ name: funcName, data: jsonParams });
    window.webkit.messageHandlers.jstoapp.postMessage(msg);
  } else if (device.android()) {
    window.jstoapp[funcName](jsonParams);
  } else {
    console.log(`[Start Function(${funcName})]`);
    funcStack.push(funcName, jsonParams);

    const history = useHistory();
    history.push();
  }
}

// 觸發APP返回上一頁功能
function closeFunc() {
  if (device.ios()) {
    const msg = JSON.stringify({ name: 'closeFunc' });
    window.webkit.messageHandlers.jstoapp.postMessage(msg);
  } else if (device.android()) {
    window.jstoapp.closeFunc();
  } else {
    const funcItem = funcStack.pop();
    if (funcItem) {
      console.log(`[Close Function and Back to(${funcItem.funcName})]`);

      const history = useHistory();
      history.push(funcItem.funcName);
    }
  }
}

// 開關 loading
function switchLoading(param) {
  const data = { open: param ? 'Y' : 'N' };
  if (device.ios()) {
    const msg = JSON.stringify({ name: 'onLoading', data: JSON.stringify(data) });
    window.webkit.messageHandlers.jstoapp.postMessage(msg);
  }
  if (device.android()) {
    const androidParam = JSON.stringify(data);
    window.jstoapp.onLoading(androidParam);
  }
}

function goHome() {
  funcStack.clear();
  goToFunc('/more');
}

export {
  goToFunc,
  closeFunc,
  goHome,
  switchLoading,
};
