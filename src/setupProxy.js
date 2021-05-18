const { createProxyMiddleware } = require('http-proxy-middleware');

// eslint-disable-next-line func-names
module.exports = function (app) {
// proxy第一个参数为要代理的路由
// 第二参数中target为代理後的请求網址，changeOrigin是否改变请求頭
  app.use(createProxyMiddleware('/auth', {
    target: 'https://appbankee-t.feib.com.tw/webctrl/aplfx',
    changeOrigin: true,
  }));
  app.use(createProxyMiddleware('/aplfx', {
    target: 'https://appbankee-t.feib.com.tw/webctrl/aplfx',
    changeOrigin: true,
  }));
  app.use(createProxyMiddleware('/dev', {
    target: 'https://appbankee-t.feib.com.tw/webctrl/aplfx',
    changeOrigin: true,
  }));
  app.use(createProxyMiddleware('/aplModule', {
    target: 'https://appbankee-t.feib.com.tw/webctrl/aplfx',
    changeOrigin: true,
  }));
};
