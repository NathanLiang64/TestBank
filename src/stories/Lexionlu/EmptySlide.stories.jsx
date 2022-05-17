import EmptySlide from 'pages/C00600_DepositPlan/components/EmptySlide';

const doc = `### 組件說明
存錢計畫的上方卡片，當沒計畫時使用。

### 可傳參數

1. title -> 標題。
2. slogan -> 標語。

`;

export default {
  title: 'lexionlu/EmptySlide',
  component: EmptySlide,
  argTypes: {
    title: { control: 'text' },
    slogan: { control: 'text' },
  },
  parameters: {
    docs: { description: { component: doc }},
  },
};

const Template = (args) => (
  <EmptySlide {...args} />
);

export const Primary = Template.bind({});
