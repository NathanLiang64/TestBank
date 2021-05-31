import { Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import Header from 'components/Header';
import ShakeShake from 'pages/ShakeShake';
import routes from 'routes';

/* Store */
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from 'stores';
import store from './stores';

const App = () => (
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
      <ShakeShake />
    </PersistGate>
  </Provider>
);
export default App;
