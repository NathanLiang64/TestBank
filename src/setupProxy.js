const { createProxyMiddleware } = require('http-proxy-middleware');

// eslint-disable-next-line func-names
module.exports = function (app) {
  // DEUBG 精誠隨想整合用
  app.use(createProxyMiddleware('/sm', {
    target: process.env.REACT_APP_SM_CTRL_URL,
    changeOrigin: true,
    pathRewrite: {
      '/smApi/': '/api/',
      '/smJwe/': '/api/', // 為了提供 axios 判斷是否為 JWE 加密。
    },
  }));

  // proxy 第一個參數為要代理的路由
  // 第二個參數中 target 為代理後的請求網址，changeOrigin 是否改變請求頭
  app.use(createProxyMiddleware('/api', {
    target: process.env.REACT_APP_URL,
    changeOrigin: true,
  }));

  // TODO：支援開發及Prototype測試使用
  app.use(createProxyMiddleware('/auth', {
    target: process.env.REACT_APP_URL,
    changeOrigin: true,
  }));

  // app.use(createProxyMiddleware('/aplfx', {
  //   target: baseURL,
  //   changeOrigin: true,
  // }));
  // app.use(createProxyMiddleware('/dev', {
  //   target: baseURL,
  //   changeOrigin: true,
  // }));
  // app.use(createProxyMiddleware('/aplModule', {
  //   target: baseURL,
  //   changeOrigin: true,
  // }));
};
