/* eslint-disable */
function setEnCrydata(event) {
  alert(JSON.stringify(event));
  // Crydata: aes, Enivec: iv
  const { Crydata, Enivec } = event;
  alert('Crydata: ' + Crydata);
  alert('Enivec: ' + Enivec);
};

console.log('load app to webview functions success');
