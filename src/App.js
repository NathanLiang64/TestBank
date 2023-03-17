import { Suspense, useLayoutEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { getOsType } from 'utilities/AppScriptProxy';
import routes from 'routes';
import Loading from 'components/Loading';
// NOTE useNavigation 必須要在此先引用, 以註冊registFuncJumpHandler相關事件監聽
import { useNavigation, registFuncJumpHandler } from 'hooks/useNavigation'; // eslint-disable-line

/* Store */
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './stores/store';

const App = () => {
  // const Middleware = (Page) => (() => <Page />); // NOTE 暫時拿掉 因為與某些模組會產生頁面衝突 成白畫面
  useLayoutEffect(() => { // 暫時用 useLayoutEffect 替代 Middleware
    registFuncJumpHandler();
  }, []);

  useLayoutEffect(() => {
    // web版開發用: 當pathname為空, 自動跳轉到B001
    if (getOsType(true) === 3 && window.location.pathname.split('/')[1] === '') {
      window.location.href = `${process.env.REACT_APP_ROUTER_BASE}/B00100`;
    }
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* 切換 Route 過程中，顯示的等待畫面 */}
        <Suspense fallback={<Loading isFullscreen />}>
          <Switch>
            {
              routes.map((route) => {
                const { path, exact, component } = route;
                return <Route key={path} path={path} exact={exact} component={component} />;
              })
            }
          </Switch>
        </Suspense>
      </PersistGate>
    </Provider>
  );
};
export default App;
