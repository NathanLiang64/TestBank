/* eslint-disable */
const device = {
  ios: () => /iPhone|iPad|iPod/i.test(navigator.userAgent),
  android: () => /Android/i.test(navigator.userAgent),
};

// 取得 APP 給的加解密資料
function setEnCrydata(event) {
  const { Crydata, Enivec } = event;
  const aesKey = window.atob(Crydata).substr(7);
  const iv = window.atob(Enivec).substr(7);
  localStorage.setItem('aesKey', aesKey);
  localStorage.setItem('iv', iv);
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

// APP 主動更新網頁jwtToken
function returnAuthdata(event) {
  const { auth } = event;
  document.cookie = 'jwtToken=' + auth;
}

console.log('load app to webview functions success');
