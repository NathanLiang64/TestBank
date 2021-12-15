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
  const { funcParams, keepData } = event;
  if (funcParams) {
    alert(`page data from app: ${funcParams}`);
    localStorage.setItem('funcParams', funcParams);
  }
  if (keepData) {
    alert(`page data from app: ${keepData}`);
    localStorage.setItem('keepData', keepData);
  }
};

console.log('load app to webview functions success');
