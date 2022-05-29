/* eslint-disable no-bitwise */
/* eslint-disable object-curly-newline */
/* eslint-disable no-use-before-define */
/* eslint-disable brace-style */
/* eslint-disable prefer-template */
import {
  createTransactionAuth,
  transactionAuthVeriify,
} from 'proto/forAppApi';
// import e2ee from './E2ee';
import { customPopup, showError, showInfo } from './MessageModal';

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
 * @param {*} authCode 要求進行的驗證模式的代碼。
 * @param {*} otpMobile 簡訊識別碼發送的手機門號。當綁定或變更門號時，因為需要確認手機號碼的正確性，所以要再驗OTP
 * @returns {
 *   code: 執行狀態。00.成功, 其他代碼分別表示不同 JS funciton 的失敗訊息。
 *   data: 執行結果。例：OTP驗證，則傳回使用者輸入的「驗證碼」。
 * }
 */
async function transactionAuth(authCode, otpMobile) {
  const promise = new Promise((resolve) => {
    const request = {
      authCode,
      otpMobile,
      callback: (result) => {
        console.log('*** OTP Result from APP : ', result);
        localStorage.setItem('appJsResponse', result.data); // 將 APP 傳回的資料寫回。
        resolve(result);
      },
    };

    if (device.ios()) {
      const msg = JSON.stringify({ name: 'onVerification', data: JSON.stringify(request) });
      window.webkit?.messageHandlers.jstoapp.postMessage(msg);
    }
    else if (device.android()) {
      const androidParam = JSON.stringify(request);
      window.jstoapp?.onVerification(androidParam);
    }
    else {
      appTransactionAuth(request);
    }
  });

  const result = await promise;
  console.log('*** OTP Result from Promise : ', result);
  await showInfo('交易驗證結果：' + (result.result ? '成功' : '失敗'));
  return result;
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
  let allowed2FA = ((loginMode === 11 || loginMode === 21) && boundMID && ((authCode & 0x20) !== 0)); // 表示可以使用 生物辨識或圖形鎖 通過驗證。

  const failTimes = 0; // TODO 若三次不通過，則改為使用網銀密碼驗證！
  allowed2FA = allowed2FA && (failTimes < 3);

  // 檢查是否需輸入網銀密碼（只要有 2FA 的功能，就不用輸入密碼；只有在三次驗不過之後，才切換到用密碼驗證）
  const allowedPWD = (!allowed2FA && (loginMode === 21) && (authCode & 0x1F) !== 0); // 表示可以使用 網銀密碼或OTP或(網銀密碼+OTP) 通過驗證。
  const inputPwd = (allowedPWD && (authCode & 0x10)); // 表示需要輸入網銀密碼

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
          <p>輸入 xxx 表示驗證失敗！</p>
          <br />
        </div>
      ) : null}
    </div>
  );

  // 驗證 OTP Code 是否正確。
  const onOk = async () => {
    // TODO 2FA驗證模式應該自動驗證，不需要使用者按OK；一旦驗證通過，則自動關閉視窗，並傳回結果。
    const auth2FA = document.querySelector('#auth2FA')?.value; // 可以讓Server端確認真的通過驗證的資料，例：全景的驗證資料

    // 驗證 OTP驗證碼 & 網銀密碼
    const otpCode = document.querySelector('#otpCode')?.value; // 使用者輸入的「驗證碼」。
    // const netbankPwd = e2ee(document.querySelector('#netbankPwd')?.value); // 使用者輸入的「網銀密碼」，還要再做 E2EE。
    const netbankPwd = document.querySelector('#netbankPwd')?.value; // DEBUG 使用者輸入的「網銀密碼」，還要再做 E2EE。
    const veriifyRs = await transactionAuthVeriify({ authKey: txnAuth.key, funcCode, auth2FA, netbankPwd, otpCode });
    if (!veriifyRs) return false; // createTransactionAuth 發生異常就結束。
    if (veriifyRs.result === true) {
      callback({
        result: true, // 正常結果。
        message: null,
      });
    } else {
      await showError(veriifyRs.message);
      return false;
    }
    return veriifyRs.result;
  };

  // 表示使用者取消。
  const onCancel = () => callback({
    result: false,
    message: '使用者取消驗證。',
  });

  customPopup('交易授權驗證 (測試版)', body, onOk, onCancel);
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
