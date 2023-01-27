import FavoriteBlockButton from 'components/FavoriteBlockButton';
import { C001 } from 'assets/images/icons';

export default {
  title: 'components/FavoriteBlockButton',
  component: FavoriteBlockButton,
  argTypes: {
    icon: { control: 'object' },
    label: { control: 'text' },
    className: { control: 'text' },
    disabled: { control: 'boolean' },
    onClick: { action: 'onClick' },
    data: { control: 'object' },
    noCheckbox: { control: 'boolean' },
    noBorder: { control: 'boolean' },
  },
};

const Template = (args) => (
  <FavoriteBlockButton {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  label: '帳戶總覽',
  icon: <C001 />,
};
