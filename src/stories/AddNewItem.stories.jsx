import AddNewItem from '../components/AddNewItem';

const doc = `### 組件說明
新增各類設定選項

### 可傳參數

1. addLabel: 新增項目說明
2. onClick: 點擊事件呼叫函式

`;

export default {
  title: 'components/AddNewItem',
  components: AddNewItem,
  argTypes: {
    addLabel: { control: 'text' },
    onClick: { action: 'onClick' },
  },
  parameters: {
    docs: { description: { component: doc }},
  },
};

const Template = (args) => (
  <AddNewItem {...args} />
)

export const Primary = Template.bind({});
Primary.args = {
  addLabel: '新增',
};
