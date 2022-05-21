import { Provider } from 'react-redux';

import store from 'stores/store';
import DebitCard from 'components/DebitCard';
import presetColors from '../presetColors';

const doc = `### 組件說明
存款卡組件

### 可傳參數

1. type -> 卡片類型，決定卡片顯示簡易內容或完整內容
   預設不傳為顯示簡易內容，傳入 "original" 字串會顯示完整內容
2. branch -> 分行名稱，組件 type 為 original 的卡片 (完整內容) 才需要傳入
3. cardName -> 卡片名稱
4. account -> 卡片帳號
5. accountType -> 帳戶科目別 (ex: "004")
6. balance -> 卡片餘額，輸入純數字即可，顯示時會自動加上貨幣符號及千分位逗點
7. hideIcon -> 此組件預設會在餘額前顯示眼睛圖示的 Icon Button
   點擊 Icon 後可隱藏餘額，倘若不需要此功能請在組件加上 hideIcon 屬性
8. functionList -> 卡片功能清單，型別為陣列，組件 type 為 original 的卡片 (完整內容) 才需要傳入
9. transferLimit -> 轉帳優惠總次數
10. transferRemaining -> 轉帳優惠剩餘次數
11.moreList -> 點擊更多圖標後彈出的更多功能清單，型別為陣列，組件 type 為 original 的卡片 (完整內容) 才需要傳入
12.moreDefault -> 是否顯示更多功能清單，預設為顯示
13.dollarSign -> 貨幣符號，預設為 '$'
14.color -> 卡片顏色，預設紫色

`;

export default {
  title: 'components/-DebitCard',
  component: DebitCard,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
  argTypes: {
    type: { control: 'select', options: ['original'] },
    branch: { control: 'text' },
    cardName: { control: 'text' },
    account: { control: 'text' },
    accountType: { control: 'text' },
    balance: { control: 'number' },
    hideIcon: { control: 'boolean' },
    functionList: { control: 'array' },
    transferLimit: { control: 'number' },
    transferRemaining: { control: 'number' },
    moreList: { control: 'array' },
    moreDefault: { control: 'boolean' },
    dollarSign: { control: 'text' },
    color: { control: { type: 'color', presetColors: presetColors(['card']) }},
  },
  parameters: {
    docs: { description: { component: doc }},
  },
};

const Template = (args) => (
  <DebitCard {...args} />
);

export const Primary = Template.bind({});
