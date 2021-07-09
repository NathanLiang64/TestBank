/* eslint-disable prefer-template */
const device = {
  ios: () => /iPhone|iPad|iPod/i.test(navigator.userAgent),
  android: () => /Android/i.test(navigator.userAgent),
};

function goToFunc(funcName, jsonParams = null) {
  if (device.ios) {
    const msg = JSON.parse('{"name":"' + funcName + '", "data":"' + jsonParams + '"}');
    // eslint-disable-next-line no-undef
    webkit.messageHandlers.bankeeplus.postMessage(msg);
    return;
  }

  if (device.android) {
    window.bankeeplus.gotofunc(funcName, jsonParams);
  }
}

function closeFunc(jsonParams = null) {
  if (device.ios) {
    const msg = JSON.parse('{"data":"' + jsonParams + '"}');
    // eslint-disable-next-line no-undef
    webkit.messageHandlers.bankeeplus.postMessage(msg);
    return;
  }

  if (device.android) {
    window.bankeeplus.closefunc(jsonParams);
  }
}

export {
  goToFunc,
  closeFunc,
};
