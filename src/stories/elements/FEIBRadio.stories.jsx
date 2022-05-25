import FEIBRadio from 'components/elements/FEIBRadio';
import FEIBRadioLabel from 'components/elements/FEIBRadioLabel';

import presetColors from '../presetColors';

const doc = `### 可用選項

1. $color -> 文字顏色
   填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)，預設為深藍灰色
2. $iconColor -> 圖標顏色
   填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)，預設深藍灰色

`;

export default {
  title: 'elements/FEIBRadio',
  component: FEIBRadioLabel,
  subcomponents: { FEIBRadio },
  argTypes: {
    $color: { control: { type: 'color', presetColors: presetColors(['text']) }},
    $iconColor: { control: { type: 'color', presetColors: presetColors(['text']) }},
    label: { control: { type: 'text' }},
    value: { control: { type: 'text' }},
  },
  parameters: {
    docs: { description: { component: doc }},
  },
};

const Template = (args) => (
  <FEIBRadioLabel control={<FEIBRadio {...args} />} {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  label: 'Dog',
  value: '1',
};
