/* eslint-disable */
const device = {
  ios: () => /iPhone|iPad|iPod/i.test(navigator.userAgent),
  android: () => /Android/i.test(navigator.userAgent),
};

// 開關 loading
function switchLoadingInTag(param) {
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

// 取得 APP 給的加解密資料
function setEnCrydata(event) {
  const { Crydata, Enivec } = event;
  const aesKey = window.atob(Crydata).substr(7);
  const iv = window.atob(Enivec).substr(7);
  localStorage.setItem('aesKey', aesKey);
  localStorage.setItem('iv', iv);
  switchLoadingInTag(false)
};

// 取得來自 APP 的功能資料
function setPagedata(event) {
  const { funcParams, keepData } = event;
  if (funcParams) {
    localStorage.setItem('funcParams', funcParams);
  }
  if (keepData) {
    localStorage.setItem('keepData', keepData);
  }
};

console.log('load app to webview functions success');
