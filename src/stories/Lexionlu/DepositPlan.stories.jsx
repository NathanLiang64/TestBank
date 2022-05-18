import DepositPlan from 'pages/C00600_DepositPlan/components/DepositPlan';

export default {
  title: 'lexionlu/DepositPlan',
  component: DepositPlan,
  argTypes: {
    currentValue: { control: { type: 'range', min: 0 } },
    targetValue: { control: { type: 'number', mine: 0 } },
    expireDate: { control: { type: 'text'} },
  },
};

const Template = (args) => (
  <DepositPlan {...args} />
);

export const Progress0 = Template.bind({});
Progress0.args = {
  currentValue: 0,
  expireDate: '2099-12-31',
};

export const Progress25 = Template.bind({});
Progress25.args = {
  currentValue: 25,
  expireDate: '2099-12-31',
};

export const Progress50 = Template.bind({});
Progress50.args = {
  currentValue: 50,
  expireDate: '2099-12-31',
};

export const Progress75 = Template.bind({});
Progress75.args = {
  currentValue: 75,
  expireDate: '2099-12-31',
};

export const Progress99 = Template.bind({});
Progress99.args = {
  currentValue: 99,
  expireDate: '2099-12-31',
};

export const Success = Template.bind({});
Success.args = {
  currentValue: 100,
  expireDate: '2099-12-31',
};

export const Failed = Template.bind({});
Failed.args = {
  currentValue: 99,
  expireDate: '2000-01-01',
};
