import { useHistory } from 'react-router';
import { useEffect, useState } from 'react';
import { StarRounded } from '@material-ui/icons';
import { getThisMonth } from 'utilities/MonthGenerator';

/* Elements */
import Layout from 'components/Layout/Layout';
import {
  FEIBTab, FEIBTabContext, FEIBTabList,
} from 'components/elements';

/* Reducers & JS functions */
import { useCheckLocation, usePageInfo } from 'hooks';
import { ArrowNextIcon } from 'assets/images/icons';
import { currencySymbolGenerator } from 'utilities/Generator';
import { getBonusPeriodList, getDepositPlus, getDepositPlusLevelList } from './api';
import DepositPlusWrapper from './depositPlus.style';

/**
 * DepositPlus 優惠利率額度
 */
const Deposit = () => {
  const [tabId, setTabId] = useState('');
  const [monthly, setMonthly] = useState([]);
  const [levelList, setLevelList] = useState([]);
  const [depositPlusDetail, setDepositPlusDetail] = useState({});

  const history = useHistory();

  const renderMonthlyTabs = (list) => list.map((month) => (
    <FEIBTab key={month} label={`${month.substr(4)}月`} value={month} />
  ));

  const renderTabArea = (monthList) => (
    <FEIBTabContext value={tabId}>
      <FEIBTabList onChange={(event, id) => setTabId(id)} $size="small" className="tabList" $isSingleTab={monthList.length === 1}>
        { renderMonthlyTabs(monthList) }
      </FEIBTabList>
    </FEIBTabContext>
  );

  const nextPage = () => {
    history.push('/depositPlusDetail', { bonusDetail: depositPlusDetail.bonusDetail, year: tabId.substr(0, 4) });
  };

  useCheckLocation();
  usePageInfo('/api/depositPlus');

  useEffect(() => {
    getBonusPeriodList({})
      .then((response) => {
        const sortedMonthly = response?.sort((a, b) => b - a);
        if (!response.length) sortedMonthly.push(getThisMonth()); // 如果沒有回傳資料，顯示系統年月
        setMonthly(sortedMonthly);
        setTabId(sortedMonthly[0]);
      });
  }, []);

  useEffect(() => {
    if (monthly.length) setTabId(monthly[0]);
  }, [monthly.length]);

  // 切換頁籤撈取不同月份資料
  useEffect(() => {
    if (tabId) {
      getDepositPlus({ dateRange: tabId })
        .then((response) => setDepositPlusDetail(response));
    }
  }, [tabId]);

  // 優惠利率額度等級表，點開彈窗再撈取資料
  useEffect(() => {
    const year = `${tabId.substr(0, 4)}`;
    // 如果已有資料則不再重複撈取資料
    if (!levelList.length) {
      getDepositPlusLevelList({ year })
        .then((response) => setLevelList(response ?? []));
    }
  }, [levelList.length]);

  return (
    <Layout title="優惠利率額度">
      <DepositPlusWrapper>
        { tabId && monthly.length && renderTabArea(monthly) }

        <div className="mainArea">
          <span>
            {/* 如果沒有回傳資料，顯示系統年月 */}
            {!!depositPlusDetail.period && `${!depositPlusDetail.period ? monthly[0].substr(0, 4) : depositPlusDetail.period.substr(0, 4)}/${!depositPlusDetail.period ? monthly[0].substr(4) : depositPlusDetail.period.substr(4)}`}
            優惠利率額度總計
          </span>
          {!!depositPlusDetail.summaryBonusQuota && <h3>{currencySymbolGenerator('NTD', parseInt(depositPlusDetail.summaryBonusQuota, 10))}</h3>}
        </div>

        {!!depositPlusDetail.bonusDetail && (
        <section className="detailArea">
          <div className="sectionTitle">
            <h3>活動明細</h3>
            {depositPlusDetail.bonusDetail.length !== 0 && (
            <button type="button" onClick={() => nextPage()}>
              各項活動說明
              <ArrowNextIcon />
            </button>
            )}
          </div>

          <ul className="detailList">
            <li className="listHead">
              <span>活動名稱/說明</span>
              <span>優惠定額上限</span>
            </li>
            {depositPlusDetail.bonusDetail.map((detail) => (
              <li className="listBody" key={detail}>
                <div>
                  <p>
                    {/* 藉promotionName字串中有無"*"判斷是否顯示starIcon */}
                    {detail.promotionName.replace('*', '')}
                    <span>{detail.promotionName.includes('*') && <StarRounded className="starIcon" />}</span>
                  </p>
                  <span>{detail.memo}</span>
                </div>
                <p className="limitPrice">
                  {currencySymbolGenerator('NTD', parseInt(detail.bonusQuota, 10))}
                </p>
              </li>
            ))}
          </ul>

          <div className="remarkArea">
            <span>標示</span>
            <StarRounded className="starIcon" />
            <span>活動之優惠利率擇優計算</span>
          </div>
        </section>
        )}
      </DepositPlusWrapper>
    </Layout>
  );
};

export default Deposit;
