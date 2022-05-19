import ThreeColumnInfoPanel from 'components/ThreeColumnInfoPanel';

export default {
  title: 'lexionlu/ThreeColumnInfoPanel',
  component: ThreeColumnInfoPanel,
  argTypes: {
    isLoading: { control: 'boolean' },
  },
};

const content = [
  { label: '適用利率', value: '0.6%' },
  { label: '每月存款日', value: '26號', onClick: ()=>{return} },
  { label: '每次存款金額', value: '1萬', onClick: ()=>{return}, iconType: 'switch' },
];

const Template = (args) => (
  <ThreeColumnInfoPanel content={content} {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  isLoading: false,
};
