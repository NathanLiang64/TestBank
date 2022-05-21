import InformationTape from 'components/InformationTape';

export default {
  title: 'components/InformationTape',
  component: InformationTape,
  argTypes: {
    img: { control: 'text' },
    topLeft: { control: 'text' },
    topRight: { control: 'text' },
    bottomLeft: { control: 'text' },
    bottomRight: { control: 'text' },
    onClick: { action: 'onClick' },
  },
};

const Template = (args) => (
  <InformationTape {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  img: '/logo192.png',
  topLeft: '跨行轉入',
  bottomLeft: '12/08 - 345-17282981',
  topRight: '$2,650',
  bottomRight: '$212,456,874',
};
