import DepositPlan from 'pages/C00600_DepositPlan/components/DepositPlan';

const doc = `### 組件說明
存錢計畫下方資訊卡

### 可傳參數

1. currentBalance: number -> 目前金額，預設NTD。
2. goalAmount: number -> 目標金額，預設NTD。
3. endDate: string -> YYYYMMDD
4. progInfo -> 存錢計劃適用方案(Program)資訊
5. amount -> 每期存入金額，格式：99999。
6. cycleMode -> 存入週期（1.每周、2.每月）
7. cycleTiming -> 存入時機；每周：0～6(周日～周六)、每月：1~28及月底(31)
8. onShowDetailClick: function -> 點擊「存錢歷程」觸發。
9. onTerminatePlanClick: function -> 點擊「結束本計畫」觸發。

`;

export default {
  title: 'lexionlu/DepositPlan',
  component: DepositPlan,
  argTypes: {
    currentBalance: {
      control: {
        type: 'range', min: 0, max: 1010000, step: 10000,
      },
    },
    goalAmount: {
      control: {
        type: 'range', min: 0, max: 1000000, step: 10000,
      },
    },
    endDate: { control: { type: 'text'} },
    progInfo: { control: { type: 'array' } },
    amount: {
      control: {
        type: 'range', min: 0, max: 10000, step: 1000,
      },
    },
    cycleMode: { control: { type: 'number' } },
    cycleTiming: { control: { type: 'number' } },
    onShowDetailClick: { action: 'onShowDetailClick' },
    onTerminatePlanClick: { action: 'onTerminatePlanClick' },
  },
  parameters: {
    docs: { description: { component: doc }},
  },
};

const Template = (args) => (
  <DepositPlan {...args} />
);

export const Progress0 = Template.bind({});
Progress0.args = {
  currentBalance: 0,
  endDate: '20991231',
  progInfo: { rate: '0.6' },
  amount: 1000,
  cycleMode: 2,
  cycleTiming: 31,
};

export const Progress25 = Template.bind({});
Progress25.args = {
  currentBalance: 250000,
  endDate: '20991231',
  progInfo: { rate: '0.6' },
  amount: 1000,
  cycleMode: 2,
  cycleTiming: 31,
};

export const Progress50 = Template.bind({});
Progress50.args = {
  currentBalance: 500000,
  endDate: '20991231',
  progInfo: { rate: '0.6' },
  amount: 1000,
  cycleMode: 2,
  cycleTiming: 31,
};

export const Progress75 = Template.bind({});
Progress75.args = {
  currentBalance: 750000,
  endDate: '20991231',
  progInfo: { rate: '0.6' },
  amount: 1000,
  cycleMode: 2,
  cycleTiming: 31,
};

export const Progress99 = Template.bind({});
Progress99.args = {
  currentBalance: 990000,
  endDate: '20991231',
  progInfo: { rate: '0.6' },
  amount: 1000,
  cycleMode: 2,
  cycleTiming: 31,
};

export const Success = Template.bind({});
Success.args = {
  currentBalance: 1000000,
  endDate: '20991231',
  progInfo: { rate: '0.6' },
  amount: 1000,
  cycleMode: 2,
  cycleTiming: 31,
};

export const Failed = Template.bind({});
Failed.args = {
  currentBalance: 990000,
  endDate: '20000101',
  progInfo: { rate: '0.6' },
  amount: 1000,
  cycleMode: 2,
  cycleTiming: 31,
};
