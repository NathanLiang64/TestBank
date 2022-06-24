import Badge from 'components/Badge';

import presetColors from '../presetColors';

export default {
  title: 'lexionlu/Badge',
  component: Badge,
  argTypes: {
    children: { control: 'text' },
    label: { control: 'text' },
    value: { control: 'text' },
    $color: { control: { type: 'color', presetColors: presetColors(['text']) }},
  },
};

const Template = (args) => (
  <Badge {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  label: '新增存錢計畫',
  value: '新增存錢計畫',
};
