import EmptyPlan from 'pages/C00600_DepositPlan/components/EmptyPlan';

export default {
  title: 'lexionlu/EmptyPlan',
  component: EmptyPlan,
  argTypes: {
    onAddClick: { action: 'onAddClick' },
  },
};

const Template = (args) => (
  <EmptyPlan {...args} />
);

export const Primary = Template.bind({});
