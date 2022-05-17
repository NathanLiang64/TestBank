import DepositDetailPanel from 'components/DepositDetailPanel/depositDetailPanel';

export default {
  title: 'components/DepositDetailPanel',
  component: DepositDetailPanel,
  argTypes: {
    details: { control: 'array' },
    onClick: { action: 'onClick' },
  },
};

const Template = (args) => (
  <DepositDetailPanel {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  details: [],
};
