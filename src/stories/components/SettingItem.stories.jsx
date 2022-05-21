import SettingItem from 'components/SettingItem';

const doc = `### 組件說明
新增各類設定選項

### 可傳參數

1. mainLable,
1. subLabel,
1. editClick,
1. deleteClick,

`;

export default {
  title: 'components/SettingItem',
  component: SettingItem,
  argTypes: {
    mainLable: { control: 'text' },
    subLabel: { control: 'text' },
    editClick: { action: 'editClick' },
    deleteClick: { action: 'deleteClick' },
  },
  parameters: {
    docs: { description: { component: doc }},
  },
};

const Template = (args) => (
  <SettingItem {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  mainLable: 'Jermey123',
  subLabel: '遠東商銀 043000990000',
};
