import { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import routes from 'routes';
import Loading from 'components/Loading';
import { registFuncJumpHandler } from 'utilities/AppScriptProxy';

/* Store */
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './stores/store';

const App = () => {
  const Middleware = (Page) => (() => {
    registFuncJumpHandler();
    return <Page />;
  });

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* 切換 Route 過程中，顯示的等待畫面 */}
        <Suspense fallback={<Loading isFullscreen />}>
          <Switch>
            {
              routes.map((route) => {
                const { path, exact, component } = route;
                return <Route key={path} path={path} exact={exact} component={Middleware(component)} />;
              })
            }
          </Switch>
        </Suspense>
      </PersistGate>
    </Provider>
  );
};
export default App;
