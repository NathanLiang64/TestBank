import CopyTextIconButton from '../components/CopyTextIconButton';

import presetColors from './presetColors';

const doc = `### 組件說明
此組件封裝了 CopyToClipboard、FEIBIconButton 和 ShackModal

### 可傳參數

1. copyText -> 需要被複製的文字
2. displayMessage -> 複製後顯示的訊息，若不傳值則預設顯示 "已複製帳號"
3. iconColor -> IconButton 的圖標顏色
4. isInline -> 設定Button元件為CSS display: inline

`;

export default {
  title: 'components/CopyTextIconButton',
  components: CopyTextIconButton,
  argTypes: {
    copyText: { control: 'text' },
    displayMessage: { control: 'text' },
    iconColor: { control: { type: 'color', presetColors: presetColors(['text']) }},
  },
  parameters: {
    docs: { description: { component: doc }},
  },
};

const Template = (args) => (
  <CopyTextIconButton {...args} />
)

export const Primary = Template.bind({});
Primary.args = {
  copyText: '複製複製',
};
