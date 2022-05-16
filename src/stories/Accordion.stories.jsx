import Accordion from '../components/Accordion';

const doc = `### 組件說明
注意事項

### 可傳參數

1. className -> 若需在某些頁面更動樣式，可加上 className 參數傳入 class 名稱
2. title -> 可傳入標題，若不傳入預設為 "注意事項"
3. space -> 此組件預設無 margin，可傳入 "top"、"bottom"、"both" 字串來產生固定高度的 margin
4. children -> 顯示文字，不須設置 children 屬性，直接在標籤內部填寫文字
5. open -> 傳入 open 參數則預設開啟狀態

`;

export default {
  title: 'components/Accordion',
  component: Accordion,
  argTypes: {
    className: { control: 'text' },
    title: { control: 'text' },
    space: { control: 'select', options: ['top', 'bottom', 'both'] },
    children: { control: 'text' },
    open: { control: 'boolean' },
  },
  parameters: {
    docs: { description: { component: doc }},
  },
};

const Template = (args) => (
  <Accordion {...args} />
);

export const Primary = Template.bind({});
