import { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import Header from 'components/Header';
import BottomDrawer from 'components/BottomDrawer';
import ShakeShake from 'pages/ShakeShake';
import routes from 'routes';

/* Store */
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from 'stores';
import store from './stores';

const App = () => {
  const [openQRCodeDrawer, setQRCodeOpenDrawer] = useState(false);

  // 當用戶搖手機，從底部彈出 QRCode 收款畫面
  // const nativeActionWasTriggered = () => {
  //   setQRCodeOpenDrawer(true);
  // };

  const renderQRCodeDrawer = () => (
    <BottomDrawer
      className="QRCodeDrawer"
      isOpen={openQRCodeDrawer}
      onClose={() => setQRCodeOpenDrawer(!openQRCodeDrawer)}
      content={<ShakeShake />}
    />
  );

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Header />
        <BrowserRouter>
          <Switch>
            {
              routes.map((route) => {
                const {
                  path,
                  exact,
                  component,
                } = route;
                return <Route key={path} path={path} exact={exact} component={component} />;
              })
            }
          </Switch>
        </BrowserRouter>
        { renderQRCodeDrawer() }
      </PersistGate>
    </Provider>
  );
};

export default App;
