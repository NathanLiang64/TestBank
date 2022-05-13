import BottomAction from '../components/BottomAction';

export default {
  title: 'components/BottomAction',
  components: BottomAction,
  argTypes: {
    className: { control: 'text' },
    bottomPosition: { control: 'number' },
    children: { control: 'text' },
  },
};

const Template = (args) => (
  <BottomAction {...args} />
)

export const Primary = Template.bind({});
