import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';

import Layout from 'components/Layout/Layout';
import SwiperLayout from 'components/SwiperLayout';
import PieChart from 'components/PieChart';
import AccountCardList from './components/AccountCardList';

const mockData = {
  assets: [
    {
      type: 'M', // 帳戶類型 M:母帳戶, S:證券戶, F:外幣帳戶, C:子帳戶
      accountNo: '00011199990000', // 帳號
      balance: 10000, // 帳戶餘額（外幣會折算「當天」的台幣價值）
    },
    {
      type: 'S', // 帳戶類型 M:母帳戶, S:證券戶, F:外幣帳戶, C:子帳戶
      accountNo: '00011199990000', // 帳號
      balance: 20000, // 帳戶餘額（外幣會折算「當天」的台幣價值）
    },
    {
      type: 'F', // 帳戶類型 M:母帳戶, S:證券戶, F:外幣帳戶, C:子帳戶
      accountNo: '00011199990000', // 帳號
      balance: 30000, // 帳戶餘額（外幣會折算「當天」的台幣價值）
    },
    {
      type: 'C', // 帳戶類型 M:母帳戶, S:證券戶, F:外幣帳戶, C:子帳戶
      accountNo: '00011199990000', // 帳號
      balance: 40000, // 帳戶餘額（外幣會折算「當天」的台幣價值）
      purpose: 0, // 綁定用途（0.未綁定, 1.社群帳本, 2.存錢計畫）
    },
    {
      type: 'C', // 帳戶類型 M:母帳戶, S:證券戶, F:外幣帳戶, C:子帳戶
      accountNo: '00011199990000', // 帳號
      balance: 10000, // 帳戶餘額（外幣會折算「當天」的台幣價值）
      purpose: 1, // 綁定用途（0.未綁定, 1.社群帳本, 2.存錢計畫）
      alias: '社群帳本', // 帳戶別名 或是 社群帳本名稱、存錢計畫名稱
    },
    {
      type: 'C', // 帳戶類型 M:母帳戶, S:證券戶, F:外幣帳戶, C:子帳戶
      accountNo: '00011199990000', // 帳號
      balance: 10000, // 帳戶餘額（外幣會折算「當天」的台幣價值）
      purpose: 2, // 綁定用途（0.未綁定, 1.社群帳本, 2.存錢計畫）
      alias: '存錢計畫77', // 帳戶別名 或是 社群帳本名稱、存錢計畫名稱
    },
  ],
  debts: [
    {
      type: 'CC', // 類型 CC:信用卡, L:貸款
      accountNo: '22200099994444', // 卡號 或 貸款帳戶號
      balance: -1000, // 帳戶餘額（雖為負債，但金額「不會」是負值）
    },
    {
      type: 'L', // 類型 CC:信用卡, L:貸款
      accountNo: '22200099994444', // 卡號 或 貸款帳戶號
      balance: -2000, // 帳戶餘額（雖為負債，但金額「不會」是負值）
    },
  ],
};

const renderSlides = (data) => {
  const slides = [
    <PieChart label="正資產" data={data.assets} space="top" isCentered />,
    <PieChart label="負資產" data={data.debts} space="top" isCentered />,
  ];
  return slides;
};

const renderContents = (data) => {
  const slides = [
    <AccountCardList data={data.assets} />,
    <AccountCardList data={data.debts} />,
  ];
  return slides;
};

/**
 * C00100 帳戶總覽頁
 */
const AccountOverviewPage = () => {
  const dispatch = useDispatch();

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    // FATCH API
    dispatch(setWaittingVisible(false));
  });

  return (
    <Layout title="帳戶總覽">
      <SwiperLayout slides={renderSlides(mockData)} hasDivider={false}>
        { renderContents(mockData) }
      </SwiperLayout>
    </Layout>
  );
};

export default AccountOverviewPage;
