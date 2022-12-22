import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from 'themes/globalStyles';
import theme from 'themes/theme';

/* Components */
import App from './App';

// 由 BrowserRouter(SSR intention) 改為 HashRouter (CSR intention)，
// 有利於在網頁版開發過程中可逕行改變網址列，不會促使網頁 refresh 導致 Redux Reducer 被清空
ReactDOM.render(
  <ThemeProvider theme={theme}>
    <HashRouter basename={process.env.REACT_APP_ROUTER_BASE || ''}>
      <App />
      <GlobalStyles />
    </HashRouter>
  </ThemeProvider>,
  document.getElementById('root'),
);
