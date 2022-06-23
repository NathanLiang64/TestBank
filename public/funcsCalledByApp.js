/**
 * 負責接收 APP JavaScript API callback 的共用方法。
 * @param {*} value APP JavaScript API的傳回值。
 */
/* eslint-disable */
function AppJavaScriptCallback(value) {
  // console.log('*** Result from APP JavaScript : ', value);  
  let result;
  try {
    // 若是 JSON 格式，則以物件型態傳回。
    result = JSON.parse(value);
  } catch (ex) {
    result = value;
  }
  // AppJavaScriptCallbackPromiseResolve 是在 utility/AppScriptProxy.js 的 callAppJavaScript() 方法中定義。
  window.AppJavaScriptCallbackPromiseResolve(result);
}

/**
 * APP呼叫，通知WebView返回功能上一頁
 */
function goBack() {
  // TODO 如何通知執行中的 WebView ？
}
