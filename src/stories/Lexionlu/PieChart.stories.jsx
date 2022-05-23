import PieChart from 'components/PieChart';

const doc = `### 組件說明
圓餅圖組件

### 可傳參數

1. data -> API回傳之格式。
2. label -> 圓餅圖標題。
3. dollarSign -> 資產貨幣。
4. width -> 圓餅圖圖寬。
5. height -> 圓餅圖圖高。

`;

export default {
  title: 'lexionlu/PieChart',
  component: PieChart,
  argTypes: {
    data: { control: 'array' },
    label: { control: 'text' },
    dollarSign: { control: 'text' },
    width: { control: { type: 'number' } },
    height: { control: { type: 'number' } },
  },
  parameters: {
    docs: { description: { component: doc } },
  },
};

const Template = (args) => (
  <PieChart {...args} />
);

export const Assets = Template.bind({});
Assets.args = {
  data: [
    {
      type: 'M', // 帳戶類型 M:母帳戶, S:證券戶, F:外幣帳戶, C:子帳戶
      accountNo: '00011199990000', // 帳號
      balance: 10000, // 帳戶餘額（外幣會折算「當天」的台幣價值）
      purpose: 0, // 綁定用途（0.未綁定, 1.社群帳本, 2.存錢計畫）
      alias: 'Alias', // 帳戶別名 或是 社群帳本名稱、存錢計畫名稱
    },
    {
      type: 'S', // 帳戶類型 M:母帳戶, S:證券戶, F:外幣帳戶, C:子帳戶
      accountNo: '00011199990000', // 帳號
      balance: 10000, // 帳戶餘額（外幣會折算「當天」的台幣價值）
      purpose: 0, // 綁定用途（0.未綁定, 1.社群帳本, 2.存錢計畫）
      alias: 'Alias', // 帳戶別名 或是 社群帳本名稱、存錢計畫名稱
    },
    {
      type: 'F', // 帳戶類型 M:母帳戶, S:證券戶, F:外幣帳戶, C:子帳戶
      accountNo: '00011199990000', // 帳號
      balance: 10000, // 帳戶餘額（外幣會折算「當天」的台幣價值）
      purpose: 0, // 綁定用途（0.未綁定, 1.社群帳本, 2.存錢計畫）
      alias: 'Alias', // 帳戶別名 或是 社群帳本名稱、存錢計畫名稱
    },
    {
      type: 'C', // 帳戶類型 M:母帳戶, S:證券戶, F:外幣帳戶, C:子帳戶
      accountNo: '00011199990000', // 帳號
      balance: 10000, // 帳戶餘額（外幣會折算「當天」的台幣價值）
      purpose: 0, // 綁定用途（0.未綁定, 1.社群帳本, 2.存錢計畫）
      alias: 'Alias', // 帳戶別名 或是 社群帳本名稱、存錢計畫名稱
    },
  ],
};

export const Debts = Template.bind({});
Debts.args = {
  label: '負資產',
  data: [
    {
      type: 'CC', // 類型 CC:信用卡, L:貸款
      accountNo: '22200099994444', // 卡號 或 貸款帳戶號
      balance: -1000, // 帳戶餘額（雖為負債，但金額「不會」是負值）
    },
    {
      type: 'L', // 類型 CC:信用卡, L:貸款
      accountNo: '22200099994444', // 卡號 或 貸款帳戶號
      balance: -1000, // 帳戶餘額（雖為負債，但金額「不會」是負值）
    },
  ],
};
