import DetailCard from 'components/DetailCard';

const doc = `### 組件說明
交易明細卡片組件

### 可傳參數

1. id -> Html DOM 元素 id
2. index -> HTML data-index 參數，放置後端撈回的卡片索引值
3. inView -> HTML data-inview 參數，顯示卡片是否在畫面可視範圍
4. avatar -> 頭像圖片，沒傳值會有預設樣式
5. type -> 交易類型，後端會傳回 "c" 或 "d" 兩種字串值，"c" 表轉出，"d" 表轉入
6. title -> 明細標題
7. date -> 交易日期
8. time -> 交易時間
9. bizDate -> 帳務日期
10. dollarSign -> 貨幣單位
11. targetBank -> 目標帳號銀行代碼
12. targetAccount -> 目標帳號
13. targetMember -> 目標帳號的會員 ID
14. amount -> 交易金額
15. balance -> 交易後所剩餘額
16. noShadow -> 卡片不帶陰影樣式

`;

export default {
  title: 'components/DetailCard',
  component: DetailCard,
  argTypes: {
    id: { control: 'text' },
    index: { control: 'text' },
    inView: { control: 'text' },
    avantar: { control: 'text' },
    type: { control: 'select', options: ['c', 'd'] },
    title: { control: 'text' },
    date: { control: 'text' },
    time: { control: 'text' },
    bizDate: { control: 'text' },
    dollarSign: { control: 'text' },
    targetBank: { control: 'text' },
    targetAccount: { control: 'text' },
    targetMember: { control: 'text' },
    amount: { control: 'number' },
    balance: { control: 'number' },
    noShadow: { control: 'boolean' },
  },
  parameters: {
    docs: { description: { component: doc }},
  },
};

const Template = (args) => (
  <DetailCard {...args} />
);

export const Primary = Template.bind({});
