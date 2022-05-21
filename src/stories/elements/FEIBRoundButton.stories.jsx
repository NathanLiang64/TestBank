import FEIBRoundButton from 'components/elements/FEIBRoundButton';
import { MoreIcon, EditIcon } from 'assets/images/icons';

import presetColors from '../presetColors';

export default {
  title: 'elements/FEIBRoundButton',
  component: FEIBRoundButton,
  argTypes: {
    icon: { control: { type: 'select', options: ['more', 'edit'] }},
    fontSize: { control: { type: 'number', step: 0.1 }},
    iconColor: { control: { type: 'color', presetColors: presetColors(['text']) }},
  },
};

const Template = (args) => {
  const { fontSize, iconColor, icon } = args;
  (
    <FEIBRoundButton
      $fontSize={fontSize}
      $iconColor={iconColor}
    >
      { icon === 'more' && <MoreIcon />}
      { icon === 'edit' && <EditIcon />}
    </FEIBRoundButton>
  );
};

export const MoreRoundButton = Template.bind({});
MoreRoundButton.args = {
  icon: 'more',
};

export const EditRoundButton = Template.bind({});
EditRoundButton.args = {
  icon: 'edit',
};
