import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from 'themes/globalStyles';
import theme from 'themes/theme';

/* Components */
import App from './App';

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <BrowserRouter basename={process.env.PUBLIC_URL || ''}>
      <App />
      <GlobalStyles />
    </BrowserRouter>
  </ThemeProvider>,
  document.getElementById('root'),
);
