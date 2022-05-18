import ThreeColumnInfoPanel from 'components/ThreeColumnInfoPanel';

export default {
  title: 'lexionlu/ThreeColumnInfoPanel',
  component: ThreeColumnInfoPanel,
};

const content = [
  { label: 'XXXXX', value: '23456'  },
  { label: 'XXXXX', value: '23456', onClick: true  },
  { label: 'XXXXX', value: '23456', onClick: true, iconType: 'switch'  },
];

const Template = (args) => (
  <ThreeColumnInfoPanel content={content} {...args} />
);

export const Primary = Template.bind({});
