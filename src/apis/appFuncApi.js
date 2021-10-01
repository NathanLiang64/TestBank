/**
 * 導頁功能
 * @param {Object, 'useHistory'} history
 * @param {String, '單元功能代碼'} funcCode
 * @param {Object, '傳遞參數'} funcParams
 * @param {Boolean, '啟用 Tab bar'} hideMainMenu 預設 false
 * @param {Object, '暫存資料'} keepData 預設 null
 * @returns {Boolean, '導頁狀態'} startState 導頁成功與否
 * */

const startFunc = (
  history,
  funcCode,
  funcParams,
  // hideMainMenu = false,
  // keepData = null,
) => {
  // const startState = window.bankeeApp.functrl.startFunc(funcCode, funcParams, hideMainMenu, keepData);
  const startState = true;
  if (startState) history.push(funcCode, funcParams);
};

export {
  startFunc,
};
