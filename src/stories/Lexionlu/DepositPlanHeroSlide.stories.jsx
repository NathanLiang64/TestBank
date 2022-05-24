import DepositPlanHeroSlide from 'components/DepositPlanHeroSlide';

const doc = `### 組件說明
存錢計畫的上方卡片。

### 可傳參數

1. imgSrc -> 背景圖網址。
2. imgAlt -> 背景圖敘述。
3. title -> 標題。
4. account -> 帳戶號。
5. onMoreClicked -> 當「更多」按鈕觸發。
6. onEditClicked -> 當「編輯」按鈕觸發。
7. isSimple -> 用於存錢歷程。
8. balance -> 金額。
9. dollarSign -> 資產貨幣。

`;

export default {
  title: 'lexionlu/DepositPlanHeroSlide',
  component: DepositPlanHeroSlide,
  argTypes: {
    imgSrc: { control: 'text' },
    imgAlt: { control: 'text' },
    title: { control: 'text' },
    account: { control: 'text' },
    onMoreClicked: { action: 'onMoreClicked' },
    onEditClicked: { action: 'onEditClicked' },
    isSimple: { control: 'boolean' },
    balance: { control: { type: 'number' } },
    dollarSign: { control: 'text' },
  },
  parameters: {
    docs: { description: { component: doc }},
  },
};

const Template = (args) => (
  <DepositPlanHeroSlide {...args} />
);

export const Primary = Template.bind({});
