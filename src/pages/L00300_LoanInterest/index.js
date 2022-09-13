import { useState } from 'react';
import { useHistory } from 'react-router';
import { showDrawer, closeDrawer } from 'utilities/MessageModal';

/* Elements */
import Layout from 'components/Layout/Layout';
import DebitCard from 'components/DebitCard/DebitCard';
import InformationTape from 'components/InformationTape';
import { FEIBTabContext, FEIBTabList, FEIBTab } from 'components/elements';
import DownloadIcon from 'assets/images/icons/downloadIcon.svg';

/* Styles */
import LoanInterestWrapper from './loanInterest.style';

const LoanInterest = () => {
  const history = useHistory();

  const [dateRange, setDateRange] = useState('0');

  const handleChangeTabs = (e, value) => {
    setDateRange(value);
  };

  const toDetailPage = () => {
    history.push('/L003001');
  };

  const renderEditList = () => (
    <ul className="noticeEditList downloadItemList">
      <li onClick={() => closeDrawer()}>
        <span>
          下載 PDF
        </span>
        <img className="downloadImg" src={DownloadIcon} alt="" />
      </li>
      <li onClick={() => closeDrawer()}>
        <span>
          下載 EXCEL
        </span>
        <img className="downloadImg" src={DownloadIcon} alt="" />
      </li>
    </ul>
  );

  // 開關編輯選單
  const handleOpenDrawer = () => {
    showDrawer(
      '',
      renderEditList(),
    );
  };

  return (
    <Layout title="繳款紀錄查詢">
      <LoanInterestWrapper>
        <div className="cardArea">
          <DebitCard
            branch="branch"
            cardName="信貸"
            account="04300499001234"
            balance="20000000"
            dollarSign="NTD"
            transferTitle="跨轉優惠"
            color="lightPurple"
          />
        </div>
        <div className="contentArea">
          <div className="tools">
            <div className="iconContainer">
              <img className="downloadImg" src={DownloadIcon} alt="" onClick={handleOpenDrawer} />
            </div>
            <div className="tabsContainer">
              <FEIBTabContext value={dateRange}>
                <FEIBTabList $size="small" onChange={handleChangeTabs}>
                  <FEIBTab label="近六個月" value="0" />
                  <FEIBTab label="近一年" value="1" />
                  <FEIBTab label="近兩年" value="2" />
                  <FEIBTab label="近三年" value="3" />
                </FEIBTabList>
              </FEIBTabContext>
            </div>
          </div>
          <div className="recordsList">
            <InformationTape
              topLeft="還款金額"
              topRight="$1,250"
              bottomLeft="2021/12/31"
              bottomRight="貸款餘額 $123,456,789"
              onClick={toDetailPage}
            />
            <InformationTape
              topLeft="還款金額"
              topRight="$1,250"
              bottomLeft="2021/12/31"
              bottomRight="貸款餘額 $123,456,789"
              onClick={toDetailPage}
            />
          </div>
        </div>
      </LoanInterestWrapper>
    </Layout>
  );
};

export default LoanInterest;
