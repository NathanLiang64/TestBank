function goToFunc(funcName, jsonParams = null) {
  window.bankeeplus.gotofunc(funcName, jsonParams);
}

function closeFunc(jsonParams = null) {
  window.bankeeplus.closefunc(jsonParams);
}

export {
  goToFunc,
  closeFunc,
};
