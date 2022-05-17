import FEIBButton from 'components/elements/FEIBButton';

import presetColors from '../presetColors';

export default {
  title: 'elements/FEIBButton',
  component: FEIBButton,
  argTypes: {
    width: { control: { type: 'number' }},
    height: { control: { type: 'number' }},
    fontSize: { control: { type: 'number', step: 0.1 }},
    color: { control: { type: 'color', presetColors: presetColors(['text']) }},
    bgColor: { control: { type: 'color', presetColors: presetColors(['primary', 'secondary', 'background']) }},
    pressedBgColor: { control: { type: 'color', presetColors: presetColors(['primary', 'secondary', 'background']) }},
  },
};

const Template = (args) => (
  <FEIBButton
    $width={args.width}
    $height={args.height}
    $fontSize={args.fontSize}
    $color={args.color}
    $bgColor={args.bgColor}
    $pressedBgColor={args.pressedBgColor}
  >{args.label}</FEIBButton>
);

export const Primary = Template.bind({});
Primary.args = {
  label: '新增存錢計畫',
};
