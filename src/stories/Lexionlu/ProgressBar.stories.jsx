import ProgressBar from 'components/ProgressBar';

export default {
  title: 'lexionlu/ProgressBar',
  component: ProgressBar,
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 } },
  },
};

const Template = (args) => (
  <ProgressBar {...args} />
);

export const Primary = Template.bind({});
