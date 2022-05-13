import EmptyData from '../components/EmptyData';

import presetColors from './presetColors';

const doc = `### 組件說明
無資料可顯示時請套用此組件

`;

export default {
  title: 'components/EmptyData',
  components: EmptyData,
  argTypes: {
    content: { control: 'text' },
    color: { control: { type: 'color', presetColors: presetColors(['text']) }},
    icon: { control: 'boolean' },
  },
  parameters: {
    docs: { description: { component: doc }},
  },
};

const Template = (args) => (
  <EmptyData {...args} />
)

export const Primary = Template.bind({});
