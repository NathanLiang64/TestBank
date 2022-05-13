import CountDown from '../components/CountDown';

export default {
  title: 'components/CountDown',
  components: CountDown,
  argTypes: {
    minute: { control: 'number' },
    onEnd: { action: 'onEnd' },
    replay: { control: 'boolean' },
  },
};

const Template = (args) => (
  <CountDown {...args} />
)

export const Primary = Template.bind({});
