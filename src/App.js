import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import routes from 'route';

/* Store */
import store from './stores';

const App = () => (
  <Provider store={store}>
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
  </Provider>
);

export default App;
