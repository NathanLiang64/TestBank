import InfoArea from '../components/InfoArea';

const doc = `### 組件說明
說明文字

### 可傳參數

1. className -> 若需在某些頁面更動樣式，可加上 className 參數傳入 class 名稱
2. space -> 此組件預設無 margin，可傳入 "top"、"bottom"、"both" 字串來產生固定高度的 margin
3. children -> 顯示文字，不須設置 children 屬性，直接在標籤內部填寫文字

`;

export default {
  title: 'components/InfoArea',
  components: InfoArea,
  argTypes: {
    className: { control: 'text' },
    space: { control: 'select', options: ['top', 'bottom', 'both'] },
    children: { control: 'text' },
  },
  parameters: {
    docs: { description: { component: doc }},
  },
};

const Template = (args) => (
  <InfoArea {...args} />
)

export const Primary = Template.bind({});
Primary.args = {
  children: '累積才能成長',
};
