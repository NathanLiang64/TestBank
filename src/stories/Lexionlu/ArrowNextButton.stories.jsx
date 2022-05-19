import ArrowNextButton from 'components/ArrowNextButton';

const doc = `### 組件說明
按鈕加箭頭

### 可傳參數

1. align: ('left' | 'center' | 'right') -> CSS text-align 
2. onClick -> 點擊呼叫 
3. arialLabel: string
4. disabled: boolean
5. children -> 顯示文字，不須設置 children 屬性，直接在標籤內部填寫文字

`;

export default {
  title: 'lexionlu/ArrowNextButton',
  component: ArrowNextButton,
  argTypes: {
    ariaLabel: { control: 'text' },
    children: { control: 'text' },
    align: { control: 'select', options: ['left', 'center', 'right'] },
    disabled: { control: 'boolean' },
    onClick: { action: 'onClick' },
  },
  parameters: {
    docs: { description: { component: doc }},
  },
};

const Template = (args) => (
  <ArrowNextButton {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  children: '存錢歷程',
}
