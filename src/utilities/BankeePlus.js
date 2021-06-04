export function goToFunc(funcName, jsonParams = null) {
  window.bankeeplus.gotofunc(funcName, jsonParams);
}

export function closeFunc(jsonParams = null) {
  window.bankeeplus.closefun(jsonParams);
}
