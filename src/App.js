import { Suspense, useLayoutEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import routes from 'routes';
import Loading from 'components/Loading';

/* Store */
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './stores/store';

const App = () => {
  // const Middleware = (Page) => (() => <Page />); // NOTE 暫時拿掉 因為與某些模組會產生頁面衝突 成白畫面
  useLayoutEffect(() => { // 暫時用 useLayoutEffect 替代 Middleware
    // registFuncJumpHandler();
    if (window.startFunc) return;

    window.startFunc = ({url}) => {
      console.log('window.startFunc : ', url);

      // 還原json跳脫字元, // TODO 為何會有？
      const funcID = url.replace("\"", "\\\"")  // eslint-disable-line
        .split('/').pop(); // 取url最後一段的前4碼

      const isFunction = /^[A-Z]\d{3}$/.test(funcID.substring(0, 4));
      if (isFunction) {
        console.log(`window.startFunc is called : ${funcID}`);

        // const funcPath = `/${funcID}`;
        // console.log(history.location, funcPath);
        // if (history.location.pathname === funcPath) {
        //   store.dispatch(setWaittingVisible(false));
        // }
        // history.push(funcPath); // NOTE 同一頁 Route 會無法切換！

        // console.log(`${process.env.REACT_APP_ROUTER_BASE}/${funcID}`);
        window.location.href = `${process.env.REACT_APP_ROUTER_BASE}/${funcID}`;
      } else {
        // 外開一般的URL
        window.open(url, '_blank');
      }
    };
  }, []);

  useLayoutEffect(() => {
    // web版開發用: 當pathname為空, 自動跳轉到B001
    if (process.env.NODE_ENV === 'development' && window.location.pathname.split('/')[1] === '') {
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
