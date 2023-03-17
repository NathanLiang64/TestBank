import { Suspense, useLayoutEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { Provider } from 'react-redux';
import { getOsType } from 'utilities/AppScriptProxy';
import routes from 'routes';
import Loading from 'components/Loading';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';

/* Store */
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './stores/store';

const App = () => {
  const history = useHistory();

  // const Middleware = (Page) => (() => <Page />); // NOTE 暫時拿掉 因為與某些模組會產生頁面衝突 成白畫面
  useLayoutEffect(() => { // 暫時用 useLayoutEffect 替代 Middleware
    if (window.startFunc) return;

    window.startFunc = ({url}) => {
      // console.log('window.startFunc : ', url);
      // 還原json跳脫字元, // TODO 為何會有？
      const funcID = url.replace("\"", "\\\"")  // eslint-disable-line
        .split('/').pop(); // 取url最後一段的前4碼

      const isFunction = /^[A-Z]\d{3}$/.test(funcID.substring(0, 4));
      if (isFunction) {
        const funcPath = `/${funcID}`;
        if (history.location.pathname === funcPath) {
          // 同一個頁面不用再切換，例如：一直重覆按下方的轉帳。
          store.dispatch(setWaittingVisible(false));
          return;
        }
        history.push(funcPath);
      } else {
        // BUG 外開一般的URL：應由 APP 自行開啟外部瀏覽器，而非由 WebView 處理。
        // window.open(url, '_blank');
      }
    };
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
