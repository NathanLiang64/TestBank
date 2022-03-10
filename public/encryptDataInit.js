const checkDevice = {
  ios: () => /iPhone|iPad|iPod/i.test(navigator.userAgent),
  android: () => /Android/i.test(navigator.userAgent),
};

// webvie 通知APP取得安全資料
function getEnCrydata() {
  if (checkDevice.ios()) {
    const msg = JSON.stringify({ name: 'getEnCrydata' });
    window.webkit?.messageHandlers.jstoapp.postMessage(msg);
  }
  if (checkDevice.android()) {
    window.jstoapp.getEnCrydata();
  }
}

getEnCrydata();

console.log('init get encrypt data success');
