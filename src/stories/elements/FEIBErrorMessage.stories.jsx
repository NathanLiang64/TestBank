import FEIBErrorMessage from 'components/elements/FEIBErrorMessage';

import presetColors from '../presetColors';

export default {
  title: 'elements/FEIBErrorMessage',
  component: FEIBErrorMessage,
  argTypes: {
    children: { control: 'text' },
    $noSpacing: { control: 'boolean' },
    $color: { control: { type: 'color', presetColors: presetColors(['text']) }},
  },
};

const Template = (args) => (
  <FEIBErrorMessage {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  children: '新增存錢計畫',
};
