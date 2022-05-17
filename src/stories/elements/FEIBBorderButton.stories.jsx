import FEIBBorderButton from 'components/elements/FEIBBorderButton';

import presetColors from '../presetColors';

export default {
  title: 'elements/FEIBBorderButton',
  component: FEIBBorderButton,
  argTypes: {
    label: { control: 'text' },
    width: { control: { type: 'number' }},
    height: { control: { type: 'number' }},
    fontSize: { control: { type: 'number', step: 0.1 }},
    color: { control: { type: 'color', presetColors: presetColors(['text']) }},
    borderColor: { control: { type: 'color', presetColors: presetColors(['primary', 'secondary', 'background']) }},
  },
};

const Template = (args) => (
  <FEIBBorderButton
    $width={args.width}
    $height={args.height}
    $fontSize={args.fontSize}
    $color={args.color}
    $borderColor={args.borderColor}
  >{args.label}</FEIBBorderButton>
);

export const Primary = Template.bind({});
Primary.args = {
  label: '新增存錢計畫',
};
