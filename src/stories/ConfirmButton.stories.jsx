import ConfirmButtons from '../components/ConfirmButtons';

const doc = `### 組件說明
封裝了 1 個主要按鈕和 1 個次要按鈕，不可改變按鈕數量、樣式及排列順序
此組件旨在快速套用於諸多頁面，若有設定樣式之需求請分別匯入不同的按鈕元件


### 可傳參數

1. mainButtonValue -> 主要按鈕的顯示文字，預設為 "確定"
2. mainButtonOnClick -> 主要按鈕點擊後觸發的事件
3. subButtonValue -> 次要按鈕的顯示文字，預設為 "取消"
4. subButtonOnClick -> 次要按鈕點擊後觸發的事件
5. mainButtonDisabled -> 主要按鈕的 disabled 狀態，預設 false

`;

export default {
  title: 'components/ConfirmButtons',
  components: ConfirmButtons,
  argTypes: {
    mainButtonValue: { control: 'text' },
    mainButtonOnClick: { action: 'mainButtonOnClick' },
    subButtonValue: { control: 'text' },
    subButtonOnClick: { action: 'subButtonOnClick' },
    mainButtonDisabled: { control: 'boolean' },
  },
  parameters: {
    docs: { description: { component: doc }},
  },
};

const Template = (args) => (
  <ConfirmButtons {...args} />
)

export const Primary = Template.bind({});
