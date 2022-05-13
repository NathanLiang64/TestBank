import InformationList from '../components/InformationList';

const doc = `### 組件說明
InformationList 組件用於 2 欄的條列內容

### 可傳參數

1. title -> 顯示左側之標題文字
2. content -> 顯示於右側內容文字，與標題同水平高度
3. remark -> 顯示於右側內容文字下方的備註文字

`;

export default {
  title: 'components/InformationList',
  components: InformationList,
  argTypes: {
    title: { control: 'text' },
    content: { control: 'text' },
    remark: { control: 'text' },
  },
  parameters: {
    docs: { description: { component: doc }},
  },
};

const Template = (args) => (
  <InformationList {...args} />
)

export const Primary = Template.bind({});
Primary.args = {
  title: '轉出帳號後五碼',
  content: '*********01234',
  remark: '保時捷車友會',
};
