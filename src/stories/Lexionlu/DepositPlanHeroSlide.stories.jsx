import DepositPlanHeroSlide from 'components/DepositPlanHeroSlide';

const doc = `### 組件說明
存錢計畫的上方卡片。

### 可傳參數

1. planId -> 當 imageId 為0時，會使用 planId 抓背景圖。
2. imageId -> 選擇背景圖。
3. name -> 標題。
4. accountNo -> 帳戶號。
5. balance -> 金額。
6. isSimple -> 用於存錢歷程。
7. dollarSign -> 資產貨幣。
8. onMoreClicked -> 當「更多」按鈕觸發。
9. onEditClicked -> 當「編輯」按鈕觸發。

`;

export default {
  title: 'lexionlu/DepositPlanHeroSlide',
  component: DepositPlanHeroSlide,
  argTypes: {
    planId: { control: 'text' },
    imageId: { control: { type: 'number', min: 0, max: 6 } },
    name: { control: 'text' },
    accountNo: { control: 'text' },
    balance: { control: { type: 'number' } },
    isSimple: { control: 'boolean' },
    dollarSign: { control: 'text' },
    onMoreClicked: { action: 'onMoreClicked' },
    onEditClicked: { action: 'onEditClicked' },
  },
  parameters: {
    docs: { description: { component: doc }},
  },
};

const Template = (args) => (
  <DepositPlanHeroSlide {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  name: '存錢計畫7個字',
  accountNo: '00011199992222',
};

export const Simple = Template.bind({});
Simple.args = {
  isSimple: true,
  name: '存錢計畫7個字',
  accountNo: '00011199992222',
  balance: 1000000,
};
