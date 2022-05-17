import FEIBErrorMessage from 'components/elements/FEIBErrorMessage';

export default {
  title: 'elements/FEIBErrorMessage',
  component: FEIBErrorMessage,
  argTypes: {
    children: { control: 'text' },
    $noSpacing: { control: 'boolean' },
  },
};

const Template = (args) => (
  <FEIBErrorMessage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  children: '新增存錢計畫',
};
