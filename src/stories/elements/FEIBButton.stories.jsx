import FEIBButton from 'components/elements/FEIBButton';

import presetColors from '../presetColors';

export default {
  title: 'elements/FEIBButton',
  component: FEIBButton,
  argTypes: {
    children: { control: 'text' },
    $width: { control: { type: 'number' }},
    $height: { control: { type: 'number' }},
    $fontSize: { control: { type: 'number', step: 0.1 }},
    $color: { control: { type: 'color', presetColors: presetColors(['text']) }},
    $bgColor: { control: { type: 'color', presetColors: presetColors(['primary', 'secondary', 'background']) }},
    $pressedBgColor: { control: { type: 'color', presetColors: presetColors(['primary', 'secondary', 'background']) }},
  },
};

const Template = (args) => (
  <FEIBButton {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  children: '新增存錢計畫',
};
