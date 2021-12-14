/* eslint-disable */
function setEnCrydata(event) {
  const { Crydata, Enivec } = event;
  const aesKey = window.atob(Crydata).substr(7);
  const iv = window.atob(Enivec).substr(7);
  localStorage.setItem('iv', iv);
  localStorage.setItem('aesKey', aesKey);
};

console.log('load app to webview functions success');
