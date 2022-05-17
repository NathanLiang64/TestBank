import FEIBBorderButton from 'components/elements/FEIBBorderButton';

import presetColors from '../presetColors';

export default {
  title: 'elements/FEIBBorderButton',
  component: FEIBBorderButton,
  argTypes: {
    children: { control: 'text' },
    $width: { control: { type: 'number' }},
    $height: { control: { type: 'number' }},
    $fontSize: { control: { type: 'number', step: 0.1 }},
    $color: { control: { type: 'color', presetColors: presetColors(['text']) }},
    $borderColor: { control: { type: 'color', presetColors: presetColors(['primary', 'secondary', 'background']) }},
  },
};

const Template = (args) => (
  <FEIBBorderButton {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  children: '新增存錢計畫',
};
