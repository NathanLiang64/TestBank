import BottomDrawer from 'components/BottomDrawer';

const doc = `### 組件說明
BottomDrawer 組件封裝了 Material UI 的抽屜組件

### 可傳參數
1. className -> class 名稱
2. title -> 標題文字
3. content -> 顯示於抽屜之內容
4. noScrollable -> 當內容高度超過 Drawer 高度仍不可滾動
5. isOpen -> 根據此布林值判斷抽屜是否彈出 (true 開啟、false 關閉)
6. onClose -> 點擊抽屜背景遮罩時所觸發的事件 (通常點擊遮罩要關閉抽屜，建議傳入觸發抽屜關閉的事件)
7. onBack -> 若需要在 Drawer 中控制上一頁，直接傳入事件即可

`;

export default {
  title: 'components/BottomDrawer',
  component: BottomDrawer,
  argTypes: {
    className: { control: 'text' },
    title: { control: 'text' },
    content: { control: 'text' },
    noScrollable: { control: 'boolean' },
    isOpen: { control: 'boolean' },
    onClose: { action: 'onClose' },
    onBack: { action: 'onBack' },
  },
  parameters: {
    docs: { description: { component: doc }},
  },
};

const Template = (args) => (
  <BottomDrawer {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  isOpen: true,
  title: '選單標題',
};
