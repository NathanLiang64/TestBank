import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

/* Components */
import Layout from 'components/Layout';

/* Store */
import store from './stores';

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  </Provider>
);

export default App;
