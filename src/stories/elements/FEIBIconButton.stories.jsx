import FEIBIconButton from 'components/elements/FEIBIconButton';

import presetColors from '../presetColors';
import { HomeIcon } from 'assets/images/icons';

export default {
  title: 'elements/FEIBIconButton',
  component: FEIBIconButton,
  argTypes: {
    $fontSize: { control: { type: 'number', step: 0.1 }},
    $iconColor: { control: { type: 'color', presetColors: presetColors(['text']) }},
  },
};

const Template = (args) => (
  <FEIBIconButton {...args}>
    <HomeIcon />
  </FEIBIconButton>
);

export const Primary = Template.bind({});
