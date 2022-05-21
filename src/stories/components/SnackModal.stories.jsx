import SnackModal from 'components/SnackModal';
import { BlockSelectedIcon } from 'assets/images/icons';

const doc = `### 組件說明
用於執行某動作後出現在畫面正中央的的提示訊息 (淺主色背景 + 白色文字)

### 可傳參數

1. icon -> 顯示的圖標
2. text -> 顯示的提示訊息

`;

export default {
  title: 'components/SnackModal',
  component: SnackModal,
  argTypes: {
    text: { control: 'text' },
    icon: { control: 'object' },
  },
  parameters: {
    docs: { description: { component: doc }},
  },
};

const Template = (args) => (
  <SnackModal {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  text: '顯示的提示訊息',
  icon: <BlockSelectedIcon color="white" size="24" />,
};
