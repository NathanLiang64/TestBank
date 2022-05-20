import AccountCard from 'components/AccountCard';

const doc = `### 組件說明
帳戶總覽組件

### 可傳參數

1. accountType -> 帳戶科目別 (ex: "004")
2. cardName -> 卡片名稱
3. account -> 卡片帳號
4. balance -> 卡片餘額，輸入純數字即可，顯示時會自動加上貨幣符號及千分位逗點
5. color -> 卡片顏色，預設紫色
6. dollarSign -> 貨幣符號，預設為 '$'
7. percent -> 百分比（0~100，不含符號）
8. ariaLabel -> title for button，預設為 cardName
9. children

`;

export default {
  title: 'lexionlu/AccountCard',
  component: AccountCard,
  argTypes: {
    accountType: { control: 'text' },
    cardName: { control: 'text' },
    account: { control: 'text' },
    balance: { control: 'number' },
    color: { control: 'text' },
    dollarSign: { control: 'text' },
    percent: { control: 'number' },
    ariaLabel: { control: 'text' },
    children: { control: 'text' },
  },
  parameters: {
    docs: { description: { component: doc }},
  },
};

const Template = (args) => (
  <AccountCard {...args} />
);

export const Primary = Template.bind({});
