import CountDown from 'components/CountDown';

export default {
  title: 'components/CountDown',
  component: CountDown,
  argTypes: {
    minute: { control: 'number' },
    onEnd: { action: 'onEnd' },
    replay: { control: 'boolean' },
  },
};

const Template = (args) => (
  <CountDown seconds={300} {...args} />
);

export const Primary = Template.bind({});
