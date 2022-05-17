import FEIBRoundButton from '../components/elements/FEIBRoundButton';

import presetColors from './presetColors';
import { MoreIcon, EditIcon } from 'assets/images/icons';

export default {
  title: 'elements/FEIBRoundButton',
  component: FEIBRoundButton,
  argTypes: {
    icon: { control: { type: 'select', options: ['more', 'edit'] }},
    fontSize: { control: { type: 'number', step: 0.1 }},
    iconColor: { control: { type: 'color', presetColors: presetColors(['text']) }},
  },
};

const Template = (args) => (
  <FEIBRoundButton
    $fontSize={args.fontSize}
    $iconColor={args.iconColor}
  >
    { args.icon === 'more' && <MoreIcon />}
    { args.icon === 'edit' && <EditIcon />}
  </FEIBRoundButton>
);

export const MoreRoundButton = Template.bind({});
MoreRoundButton.args = {
  icon: 'more',
};

export const EditRoundButton = Template.bind({});
EditRoundButton.args = {
  icon: 'edit',
};
