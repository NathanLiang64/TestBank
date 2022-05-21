import InfoArea from 'components/InfoArea';

import presetColors from '../presetColors';

const doc = `### 組件說明
說明文字

### 可傳參數

1. className -> 若需在某些頁面更動樣式，可加上 className 參數傳入 class 名稱
2. space -> 此組件預設無 margin，可傳入 "top"、"bottom"、"both" 字串來產生固定高度的 margin
3. children -> 顯示文字，不須設置 children 屬性，直接在標籤內部填寫文字
4. position: ('top' | 'bottom') -> 改變尖嘴的位子。
5. variants: ('top' | 'bottom') -> 改變樣式。
6. color -> 改變文字顏色。
7. bgColor -> 改變背景顏色。

`;

export default {
  title: 'components/InfoArea',
  component: InfoArea,
  argTypes: {
    className: { control: 'text' },
    space: { control: 'select', options: ['top', 'bottom', 'both', 'auto'] },
    children: { control: 'text' },
    position: { control: 'select', options: ['top', 'bottom'] },
    variant: { control: 'select', options: ['top', 'bottom'] },
    color: { control: { type: 'color', presetColors: presetColors(['primary', 'secondary', 'text']) }},
    bgColor: { control: { type: 'color', presetColors: presetColors(['primary', 'secondary', 'background']) }},
  },
  parameters: {
    docs: { description: { component: doc }},
  },
};

const Template = (args) => (
  <InfoArea {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  children: '累積才能成長',
};
