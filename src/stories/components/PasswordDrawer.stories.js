import { Provider } from 'react-redux';

import store from 'stores/store';
import PasswordDrawer from 'components/PasswordDrawer';

export default {
  title: 'components/-PasswordDrawer',
  component: PasswordDrawer,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
};

const Template = (args) => (
  <PasswordDrawer {...args} />
);

export const Primary = Template.bind({});
