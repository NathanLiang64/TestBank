import Header from 'components/Header';

export default {
  title: 'components/Header',
  component: Header,
  argTypes: {
    title: { control: 'text' },
    hideBack: { control: 'boolean' },
    hideHome: { control: 'boolean' },
    goBack: { action: 'goBack' },
    isTransparent: { control: 'boolean' },
  },
};

const Template = (args) => (
  <Header {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  isTransparent: false,
};
