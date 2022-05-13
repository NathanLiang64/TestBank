import PickerWrapper from '../components/DateRangePicker';
import DateRangePicker from '../components/DateRangePicker';

const doc = `### 組件說明
時間範圍選擇輸入框


### 可傳參數

1. label -> label 標題文字，若不傳預設為 "自訂搜尋日期區間"
2. date -> 時間範圍，型別為陣列
   陣列內第一個值為起始日，第二個值為結束日 -> date = [startDate, endDate] 若有需動態保留的時間範圍可代入，若無則預設為當日
3. onClick -> 點擊事件
   日期範圍選擇完畢後，點擊面板右下方 "確定" 後所觸發的事件，可直接在外部傳入一個 function 該 function 可以接收一個任意參數，透過該參數將可取得所選的日期範圍封裝了 1 個主要按鈕和 1 個次要按鈕，不可改變按鈕數量、樣式及排列順序此組件旨在快速套用於諸多頁面，若有設定樣式之需求請分別匯入不同的按鈕元件

`;

export default {
  title: 'components/DateRangePicker',
  components: DateRangePicker,
  decorators: [
    (Story) => (
      <PickerWrapper>
        <Story />
      </PickerWrapper>
    ),
  ],
  argTypes: {
    label: { control: 'text' },
    date: { control: 'array' },
    onClick: { action: 'onClick' },
  },
  parameters: {
    docs: { description: { component: doc }},
  },
};

const Template = (args) => (
  <ConfirmButtons {...args} />
)

export const Primary = Template.bind({});
