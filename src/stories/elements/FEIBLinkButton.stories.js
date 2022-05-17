import FEIBLinkButton from 'components/elements/FEIBLinkButton';

import presetColors from '../presetColors';

export default {
  title: 'elements/FEIBLinkButton',
  component: FEIBLinkButton,
  argTypes: {
    children: { control: 'text' },
    $color: { control: { type: 'color', presetColors: presetColors(['text']) }},
    $pressedColor: { control: { type: 'color', presetColors: presetColors(['text']) }},
  },
};

const Template = (args) => (
  <FEIBLinkButton {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  children: '新增存錢計畫',
};
