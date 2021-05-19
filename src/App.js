import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import Header from 'components/Header';
import routes from 'routes';

/* Store */
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './stores';

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Header />
      <BrowserRouter>
        <Switch>
          {
            routes.map((route) => {
              const { path, exact, component } = route;
              return <Route key={path} path={path} exact={exact} component={component} />;
            })
          }
        </Switch>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);

export default App;
