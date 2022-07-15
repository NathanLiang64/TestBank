import MemberAccountCard from 'components/MemberAccountCard';

const doc = `### 組件說明
MemberAccountCard 組件包含了 Avatar 組合成一張會員帳號卡片

### 可傳參數

1. type -> 組件型態，type 若為 '常用帳號' 才有刪除選項
2. name -> 會員名稱
3. bankNo -> 銀行代碼
4. bankName -> 銀行名稱
5. account -> 會員帳號
6. avatarSrc -> 會員頭像的圖片路徑
7. noBorder -> 無框線
8. noOption -> 左滑時無編輯 & 刪除選項、且點擊時無狀態
9. hasNewTag -> 顯示NEW標籤
10. onSelect -> 點擊會員帳號卡片事件 (選取時)
11. onEdit -> 左滑帳號卡片後，點擊編輯按鈕事件
12. onRemove -> 左滑帳號卡片後，點擊刪除按鈕事件

`;

export default {
  title: 'components/MemberAccountCard',
  component: MemberAccountCard,
  argTypes: {
    type: { control: 'select', options: ['常用帳號'] },
    name: { control: 'text' },
    bankNo: { control: 'text' },
    bankName: { control: 'text' },
    account: { control: 'text' },
    avatarSrc: { control: 'text' },
    noBorder: { control: 'boolean' },
    noOption: { control: 'boolean' },
    hasNewTag: { control: 'boolean' },
    onSelect: { action: 'onSelect' },
    onEdit: { action: 'onEdit' },
    onRemove: { action: 'onRemove' },
  },
  parameters: {
    docs: { description: { component: doc }},
  },
};

const Template = (args) => (
  <MemberAccountCard {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  type: '常用帳號',
  name: '12月的伙食費',
  bankNo: '000',
  bankName: '遠東商銀',
  account: '000-000-99991234',
  hasNewTag: true,
};
