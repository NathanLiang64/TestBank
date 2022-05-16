import HeroSlide from 'pages/C00600_DepositPlan/components/HeroSlide';

const doc = `### 組件說明
存錢計畫的上方卡片。

### 可傳參數

1. imgSrc -> 背景圖網址。
2. imgAlt -> 背景圖敘述。
3. title -> 標題。
4. account -> 帳戶號。

`;

export default {
  title: 'lexionlu/HeroSlide',
  component: HeroSlide,
  argTypes: {
    imgSrc: { control: 'text' },
    imgAlt: { control: 'text' },
    title: { control: 'text' },
    account: { control: 'text' },
  },
  parameters: {
    docs: { description: { component: doc }},
  },
};

const Template = (args) => (
  <HeroSlide {...args} />
);

export const Primary = Template.bind({});
