import { useEffect, useState } from 'react';
import { getFinanceStore } from 'pages/E00300_FinancialDepartments/api';

import Header from 'components/Header';

/* Styles */
import FinancialDepartmentsWrapper from './financialDepartments.style';

const FinancialDepartments = () => {
  const [bankList, setBankList] = useState([]);

  const getStores = async () => {
    const { code, data } = await getFinanceStore({});
    if (code === '0000') {
      setBankList(data);
    }
  };

  const openWebSite = (url) => {
    window.open(url, '_blank');
  };

  const renderCards = () => bankList.map((item) => (
    <div key={item.empBranch} onClick={() => openWebSite(item.urlLink)}>
      <div className="financialCard">
        <div className="imgContainer">
          <img src={item.logo} alt={item.name} />
        </div>
        <div className="contentContainer">
          { item.note }
        </div>
      </div>
    </div>
  ));

  useEffect(() => {
    getStores();
  }, []);

  return (
    <>
      <Header title="金融百貨" />
      <FinancialDepartmentsWrapper>
        {
          renderCards()
        }
      </FinancialDepartmentsWrapper>
    </>
  );
};

export default FinancialDepartments;
