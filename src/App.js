import { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import Header from 'components/Header';
import ShakeShake from 'pages/ShakeShake';
import routes from 'routes';

/* Store */
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from 'stores';
import store from './stores';

const App = () => {
  const [shake, setShake] = useState(false);

  // 當用戶搖手機，從底部彈出 QRCode 收款畫面
  // eslint-disable-next-line no-unused-vars
  const nativeActionWasTriggered = () => {
    setShake(true);
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Header />
        <Switch>
          {
            routes.map((route) => {
              const { path, exact, component } = route;
              return <Route key={path} path={path} exact={exact} component={component} />;
            })
          }
        </Switch>
        { shake && <ShakeShake /> }
      </PersistGate>
    </Provider>
  );
};
export default App;
