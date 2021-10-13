import { useCheckLocation, usePageInfo } from 'hooks';

/* Styles */
import BznkLogo from 'assets/images/Bznk_logo.svg';
import PezzaloanLogo from 'assets/images/Pezzaloan_logo.svg';
import AsiaEastLogo from 'assets/images/AsiaEast_logo.svg';
import FinancialDepartmentsWrapper from './financialDepartments.style';

const FinancialDepartments = () => {
  const bankList = [
    {
      id: 0,
      img: BznkLogo,
      contentText: 'BZNK讓中小企業可透過平台將應收帳款貼現。經BZNK評估，投資案件年化報酬率約5~12%。若借款人違約，投資人需依各投資案件承擔虧損風險。',
    },
    {
      id: 1,
      img: PezzaloanLogo,
      contentText: 'Pezzaloan為資金媒合平台，提供企業融資並透過AI、大數據及區塊鏈技術評估，投資案件年化利率約5~15%。若借款人違約，投資人需擔虧損風險。',
    },
    {
      id: 2,
      img: AsiaEastLogo,
      contentText: '免臨櫃24H快速線上開戶。Bankee數位證券交割帳戶+亞東證券帳戶，線上開戶一次到位，投資安全又快速！',
    },
  ];

  const renderCards = () => bankList.map((item) => (
    <div key={item.id} className="financialCard">
      <div className="imgContainer">
        <img src={item.img} alt="" />
      </div>
      <div className="contentContainer">
        { item.contentText }
      </div>
    </div>
  ));

  useCheckLocation();
  usePageInfo('/api/financialDepartments');

  return (
    <FinancialDepartmentsWrapper>
      {
        renderCards()
      }
    </FinancialDepartmentsWrapper>
  );
};

export default FinancialDepartments;
