import { ThemeProvider } from 'styled-components';

import Theme from '../src/themes/theme';
import GlobalStyles from '../src/themes/globalStyles';

export const decorators = [
  (Story) => (
    <ThemeProvider theme={Theme}>
      <Story />
      <GlobalStyles/>
    </ThemeProvider>
  ),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
