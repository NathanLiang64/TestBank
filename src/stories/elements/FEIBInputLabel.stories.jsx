import FEIBInputLabel from 'components/elements/FEIBInputLabel';

import presetColors from '../presetColors';

export default {
  title: 'elements/FEIBInputLabel',
  component: FEIBInputLabel,
  argTypes: {
    children: { control: 'text' },
    $color: { control: { type: 'color', presetColors: presetColors(['text']) }},
  },
};

const Template = (args) => (
  <FEIBInputLabel {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  children: '標題',
};
