import DepositPlan from 'pages/C00600_DepositPlan/components/DepositPlan';

const doc = `### 組件說明
存錢計畫下方資訊卡

### 可傳參數

1. currentValue: number -> 目前金額，單位為「萬」。
2. targetValue: number -> 目標金額，單位為「萬」。
3. expireDate: string -> YYYY-MM-DD
4. bonusInfo: object[] -> [{ label: string, value: string }, ...]
5. showDetails: function -> 點擊「存錢歷程」觸發。

`;

export default {
  title: 'lexionlu/DepositPlan',
  component: DepositPlan,
  argTypes: {
    currentValue: { control: { type: 'range', min: 0 } },
    targetValue: { control: { type: 'number', mine: 0 } },
    expireDate: { control: { type: 'text'} },
    bonusInfo: { control: { type: 'array' } },
    showDetails: { action: 'showDetails' },
  },
  parameters: {
    docs: { description: { component: doc }},
  },
};

const infoPanel = [
  { label: '適用利率', value: '0.6%' },
  { label: '每月存款日', value: '26號' },
  { label: '每次存款金額', value: '1萬' },
];

const Template = (args) => (
  <DepositPlan {...args} />
);

export const Progress0 = Template.bind({});
Progress0.args = {
  currentValue: 0,
  expireDate: '2099-12-31',
  bonusInfo: infoPanel,
};

export const Progress25 = Template.bind({});
Progress25.args = {
  currentValue: 25,
  expireDate: '2099-12-31',
  bonusInfo: infoPanel,
};

export const Progress50 = Template.bind({});
Progress50.args = {
  currentValue: 50,
  expireDate: '2099-12-31',
  bonusInfo: infoPanel,
};

export const Progress75 = Template.bind({});
Progress75.args = {
  currentValue: 75,
  expireDate: '2099-12-31',
  bonusInfo: infoPanel,
};

export const Progress99 = Template.bind({});
Progress99.args = {
  currentValue: 99,
  expireDate: '2099-12-31',
  bonusInfo: infoPanel,
};

export const Success = Template.bind({});
Success.args = {
  currentValue: 100,
  expireDate: '2099-12-31',
  bonusInfo: infoPanel,
};

export const Failed = Template.bind({});
Failed.args = {
  currentValue: 99,
  expireDate: '2000-01-01',
  bonusInfo: infoPanel,
};
