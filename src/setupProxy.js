const { createProxyMiddleware } = require('http-proxy-middleware');

// eslint-disable-next-line func-names
module.exports = function (app) {
  const baseURL = process.env.REACT_APP_URL;
  // proxy 第一個參數為要代理的路由
  // 第二個參數中 target 為代理後的請求網址，changeOrigin 是否改變請求頭
  app.use(createProxyMiddleware('/auth', {
    target: baseURL,
    changeOrigin: true,
  }));
  app.use(createProxyMiddleware('/api', {
    target: baseURL,
    changeOrigin: true,
  }));
  app.use(createProxyMiddleware('/aplfx', {
    target: baseURL,
    changeOrigin: true,
  }));
  app.use(createProxyMiddleware('/dev', {
    target: baseURL,
    changeOrigin: true,
  }));
  app.use(createProxyMiddleware('/aplModule', {
    target: baseURL,
    changeOrigin: true,
  }));
};
