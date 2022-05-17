import SuccessFailureAnimations from 'components/SuccessFailureAnimations';

const doc = `### 組件說明
SuccessFailureAnimations 組件再次封裝了 Animation 組件
根據傳入參數可替換成功和失敗動畫

### 可傳參數

1. isSuccess -> 判斷成功與否之條件
2. successTitle -> 成功標題
3. successDesc -> 成功時顯示之文字訊息，可傳 HTML
4. errorTitle -> 失敗標題
5. errorCode -> 失敗時顯示之錯誤代碼
6. errorDesc -> 失敗時顯示之文字資訊
7. errorSpace -> 失敗時 ErrorInfo 左右留白間距 (成功失敗畫面顯示於頁面時用、顯示於彈窗時不需傳入)
8. children -> 成功時顯示其它資訊，不需設置 children 屬性，直接在標籤內部撰寫 jsx

`;

export default {
  title: 'components/SuccessFailureAnimations',
  component: SuccessFailureAnimations,
  argTypes: {
    isSuccess: { control: 'boolean' },
    successTitle: { control: 'text' },
    successDesc: { control: 'text' },
    errorTitle: { control: 'text' },
    errorCode: { control: 'text' },
    errorDesc: { control: 'text' },
    errorSpace: { control: 'text' },
    children: { control: 'object' },
  },
  parameters: {
    docs: { description: { component: doc }},
  },
};

const Template = (args) => (
  <SuccessFailureAnimations {...args} />
)

export const Fail = Template.bind({});
Fail.args = {
  isSuccess: false,
  errorTitle: '失敗標題',
  errorCode: '錯誤代碼',
  errorDesc: '失敗訊息',
};

export const Success = Template.bind({});
Success.args = {
  isSuccess: true,
  successTitle: '成功標題',
  successDesc: '成功訊息',
};
