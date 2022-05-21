import FEIBInputAnimationWrapper from 'components/elements/FEIBInputAnimationWrapper';
import FEIBInputLabel from 'components/elements/FEIBInputLabel';
import FEIBInput from 'components/elements/FEIBInput';
import { HomeIcon } from 'assets/images/icons';

import presetColors from '../presetColors';

export default {
  title: 'elements/FEIBInputAnimationWrapper',
  component: FEIBInputAnimationWrapper,
  subcomponents: { FEIBInput, FEIBInputLabel },
  argTypes: {
    $fontSize: { control: { type: 'number', step: 0.1 }},
    $color: { control: { type: 'color', presetColors: presetColors(['text']) }},
    $borderColor: { control: { type: 'color', presetColors: presetColors(['primary', 'secondary', 'background']) }},
    $focusBorderColor: { control: { type: 'color', presetColors: presetColors(['primary', 'secondary', 'background']) }},
    $space: { control: 'select', options: ['top', 'bottom', 'both'] },
    $icon: { control: 'object' },
    $iconFontSize: { control: { type: 'number', step: 0.1 }},
    $iconOnClick: { action: 'iconOnClick' },
    label: { control: { type: 'text' }},
  },
};

const Template = (args) => {
  const { label } = args;
  (
    <FEIBInputAnimationWrapper>
      <FEIBInputLabel {...args}>{label}</FEIBInputLabel>
      <FEIBInput {...args} />
    </FEIBInputAnimationWrapper>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  label: 'Example label',
  $icon: <HomeIcon />,
};
