import FEIBInput from 'components/elements/FEIBInput';
import { HomeIcon } from 'assets/images/icons';

import presetColors from '../presetColors';

const doc = `### 可用選項

1. $fontSize -> 字級大小
   直接填寫數字，例如：1.6，若未傳值預設為 1.6
2. $color -> 文字顏色
   填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)，預設為淺主色
3. $borderColor -> 邊框顏色
   填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)，預設為淺灰色
4. $focusBorderColor -> 游標點擊後聚焦在物件時的邊框顏色
   填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)，預設為淺主色
   若已填寫 $borderColor 則直接繼承 $borderColor 色碼，也允許額外設定不同的色碼給此屬性
5. $space -> 元件上下留白空間
   預設無 margin，可傳入 "top"、"bottom"、"both" 字串來產生固定高度的 margin
6. $icon -> 圖標
   可傳入需要的圖標，顏色為淺主色，不可變更
7. $iconFontSize -> 圖標字級大小
   直接填寫數字，例如：2.4，若未傳值預設為 Material-UI 預設值 1.5
8. $iconOnClick -> 點擊圖標的事件
   可傳入點擊事件，若不傳事件則僅有不會觸發動作的圖標

`;

export default {
  title: 'elements/FEIBInput',
  component: FEIBInput,
  argTypes: {
    $fontSize: { control: { type: 'number', step: 0.1 }},
    $color: { control: { type: 'color', presetColors: presetColors(['text']) }},
    $borderColor: { control: { type: 'color', presetColors: presetColors(['primary', 'secondary', 'background']) }},
    $focusBorderColor: { control: { type: 'color', presetColors: presetColors(['primary', 'secondary', 'background']) }},
    $space: { control: 'select', options: ['top', 'bottom', 'both'] },
    $icon: { control: 'object' },
    $iconFontSize: { control: { type: 'number', step: 0.1 }},
    $iconOnClick: { action: 'iconOnClick' },
  },
  parameters: {
    docs: { description: { component: doc }},
  },
};

const Template = (args) => (
  <FEIBInput {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  $icon: <HomeIcon />,
};
