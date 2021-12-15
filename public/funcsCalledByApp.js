/* eslint-disable */
// 取得 APP 給的加解密資料
function setEnCrydata(event) {
  const { Crydata, Enivec } = event;
  const aesKey = window.atob(Crydata).substr(7);
  const iv = window.atob(Enivec).substr(7);
  localStorage.setItem('iv', iv);
  localStorage.setItem('aesKey', aesKey);
};

// 取得來自 APP 的功能資料
function setPagedata(event) {
  alert(`page data from app: ${event}`);
  localStorage.setItem('pageData', event);
};

console.log('load app to webview functions success');
