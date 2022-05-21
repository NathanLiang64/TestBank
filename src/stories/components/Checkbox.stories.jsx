import CheckboxButton from 'components/CheckboxButton';

const doc = `### 組件說明
此組件封裝了 label + checkbox

### 可傳參數

1. label -> 按鈕顯示文字
2. id -> label 的 htmlFor 和 input 的 id 皆會代入該值
3. checked -> 已選取
4. register -> 可透過綁定此參數取值，輸入字串，例：'account'
5. onChange -> input 上的 onChange 事件
6. unclickable -> 不可點擊

`;

export default {
  title: 'components/CheckboxButton',
  component: CheckboxButton,
  argTypes: {
    label: { control: 'text' },
    id: { control: 'text' },
    checked: { control: 'boolean' },
    register: { control: 'text' },
    onChange: { action: 'onChange' },
    unclickable: { control: 'boolean' },
  },
  parameters: {
    docs: { description: { component: doc }},
  },
};

const Template = (args) => (
  <CheckboxButton {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  label: '狗狗按鈕',
};
