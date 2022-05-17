import PasswordInput from 'components/PasswordInput';

import presetColors from '../presetColors';

const doc = `### 組件說明
帶有顯示、隱藏 icon 的文字輸入框

### 可傳參數

1. label -> label 標題文字，若不傳預設為 "網銀密碼"
2. id -> label 的 htmlFor、input 的 id 和 name、Controller 的 name 皆會代入該值
   註: Controller 為 react-hook-form 套件提供之功能，方便取值和驗證表單時使用
3. placeholder -> FEIBInput 的 placeholder 文字，若不傳預設為 "請輸入網銀密碼"
4. control -> 取 input 的值時可傳入 control 內容 (react-hook-form 套件的 Controller)
   註: Controller 為 react-hook-form 套件提供之功能，方便取值和驗證表單時使用
5. onBlur -> 該 input 的 onBlur 事件
6. color -> 該 input 的文字顏色，若不傳預設為主色
7. borderColor -> 該 input 的 border 顏色，若不傳預設為主色
8. errorMessage -> 驗證後的錯誤訊息

`;

export default {
  title: 'components/PasswordInput',
  component: PasswordInput,
  argTypes: {
    label: { control: 'text' },
    id: { control: 'text' },
    placeholder: { control: 'text' },
    control: { control: 'text' },
    onBlur: { action: 'onBlur' },
    borderColor: { control: { type: 'color', presetColors: presetColors(['primary', 'secondary', 'background']) }},
    errorMessage: { control: 'text' },
  },
  parameters: {
    docs: { description: { component: doc }},
  },
};

const Template = (args) => (
  <PasswordInput {...args} />
);

export const Primary = Template.bind({});
