import { useState } from 'react';
import { useHistory } from 'react-router';

/* Elements */
import Layout from 'components/Layout/Layout';
import DebitCard from 'components/DebitCard';
import InformationTape from 'components/InformationTape';
import { FEIBTabContext, FEIBTabList, FEIBTab } from 'components/elements';
import DownloadIcon from 'assets/images/icons/downloadIcon.svg';
import BottomDrawer from 'components/BottomDrawer';

/* Styles */
import LoanInterestWrapper from './loanInterest.style';

const LoanInterest = () => {
  const history = useHistory();

  const [dateRange, setDateRange] = useState('0');
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleChangeTabs = (e, value) => {
    setDateRange(value);
  };

  // 開關編輯選單
  const handleOpenDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const toDetailPage = () => {
    history.push('/L003001');
  };

  const renderEditList = () => (
    <ul className="noticeEditList downloadItemList">
      <li>
        <span>
          下載 PDF
        </span>
        <img className="downloadImg" src={DownloadIcon} alt="" />
      </li>
      <li>
        <span>
          下載 EXCEL
        </span>
        <img className="downloadImg" src={DownloadIcon} alt="" />
      </li>
    </ul>
  );

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
        <BottomDrawer
          isOpen={openDrawer}
          onClose={handleOpenDrawer}
          content={renderEditList()}
        />
      </LoanInterestWrapper>
    </Layout>
  );
};

export default LoanInterest;
