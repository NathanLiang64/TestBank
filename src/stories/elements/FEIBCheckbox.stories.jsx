import FEIBCheckbox from 'components/elements/FEIBCheckbox';
import FEIBCheckboxLabel from 'components/elements/FEIBCheckboxLabel';

import presetColors from '../presetColors';

export default {
  title: 'elements/FEIBCheckboxLabel',
  component: FEIBCheckboxLabel,
  argTypes: {
    label: { control: 'text' },
    color: { control: { type: 'color', presetColors: presetColors(['text']) }},
    iconColor: { control: { type: 'color', presetColors: presetColors(['text']) }},
  },
};

const Template = (args) => (
  <FEIBCheckboxLabel
    $color={args.color}
    control={<FEIBCheckbox $iconColor={args.iconColor} />}
    label={args.label}
  />
);

export const Primary = Template.bind({});
Primary.args = {
  label: '新增存錢計畫',
};
