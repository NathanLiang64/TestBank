import { useEffect, useState } from 'react';
import { useGetEnCrydata } from 'hooks';
import { financialDepartmentsApi } from 'apis';

import Header from 'components/Header';

/* Styles */
import FinancialDepartmentsWrapper from './financialDepartments.style';

const FinancialDepartments = () => {
  const [bankList, setBankList] = useState([]);

  const getStores = async () => {
    const storesResponse = await financialDepartmentsApi.getFinanceStore({});
    setBankList(storesResponse || []);
  };

  const renderCards = () => bankList.map((item) => (
    <a key={item.empBranch} href={item.urlLink}>
      <div className="financialCard">
        <div className="imgContainer">
          <img src={item.logo} alt={item.name} />
        </div>
        <div className="contentContainer">
          { item.note }
        </div>
      </div>
    </a>
  ));

  useGetEnCrydata();

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
