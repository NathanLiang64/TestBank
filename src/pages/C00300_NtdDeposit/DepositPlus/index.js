import { useHistory } from 'react-router';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getThisMonth } from 'utilities/MonthGenerator';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';

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
  const [depositPlusDetailMap, setDepositPlusDetailMap] = useState({});

  const dispatch = useDispatch();
  const history = useHistory();

  // 依照所選月份取得資料並儲存在map中
  const fetchDepositPlusDetailMap = async (month) => {
    const currentDepositPlusDetail = await getDepositPlus(month);

    setDepositPlusDetailMap((prevMap) => ({
      ...prevMap,
      [month]: currentDepositPlusDetail,
    }));
  };
  // 切換頁籤時，拿取當下月份的資料
  const onMonthChange = async (selectedMonth) => {
    setTabId(selectedMonth);
    if (depositPlusDetailMap[selectedMonth]) return;

    fetchDepositPlusDetailMap(selectedMonth);
  };

  const renderMonthlyTabs = (list) => list.map((month) => (
    <FEIBTab key={month} label={`${month.substr(4)}月`} value={month} />
  ));

  const renderTabArea = (monthList) => (
    <FEIBTabContext value={tabId}>
      <FEIBTabList onChange={(event, id) => onMonthChange(id)} $size="small" className="tabList" $isSingleTab={monthList.length === 1}>
        { renderMonthlyTabs(monthList) }
      </FEIBTabList>
    </FEIBTabContext>
  );

  const nextPage = () => {
    history.push('/depositPlusDetail', { bonusDetail: depositPlusDetailMap[tabId].bonusDetail, year: tabId.substr(0, 4) });
  };

  useCheckLocation();
  usePageInfo('/api/depositPlus');

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    const response = await getBonusPeriodList();
    const sortedMonthly = response?.sort((a, b) => b - a);
    if (!response.length) sortedMonthly.push(getThisMonth()); // 如果沒有回傳資料，顯示系統年月
    setMonthly(sortedMonthly);
    onMonthChange(sortedMonthly[0]);

    dispatch(setWaittingVisible(false));
  }, []);

  // 優惠利率額度等級表，點開彈窗再撈取資料
  useEffect(async () => {
    const year = `${tabId.substr(0, 4)}`;
    // 如果已有資料則不再重複撈取資料
    if (!levelList.length) {
      const response = await getDepositPlusLevelList(year);
      setLevelList(response ?? []);
    }
  }, [levelList.length]);

  return (
    <Layout title="優惠利率額度">
      <DepositPlusWrapper>
        { tabId && monthly.length && renderTabArea(monthly) }
        {depositPlusDetailMap[tabId] && (
        <div className="mainArea">
          <span>
            {/* 如果沒有回傳資料，顯示系統年月 */}
            {!!depositPlusDetailMap[tabId].period && `${!depositPlusDetailMap[tabId].period ? monthly[0].substr(0, 4) : depositPlusDetailMap[tabId].period.substr(0, 4)}/${!depositPlusDetailMap[tabId].period ? monthly[0].substr(4) : depositPlusDetailMap[tabId].period.substr(4)}`}
            優惠利率額度總計
          </span>
          {!!depositPlusDetailMap[tabId].summaryBonusQuota && <h3>{currencySymbolGenerator('NTD', parseInt(depositPlusDetailMap[tabId].summaryBonusQuota, 10))}</h3>}
        </div>
        )}
        {(depositPlusDetailMap[tabId] && !!depositPlusDetailMap[tabId].bonusDetail) && (
          <section className="detailArea">
            <div className="sectionTitle">
              <h3>活動明細</h3>
              {depositPlusDetailMap[tabId].bonusDetail.length !== 0 && (
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
              {depositPlusDetailMap[tabId].bonusDetail.map((detail) => (
                <li className="listBody" key={depositPlusDetailMap[tabId].bonusDetail.indexOf(detail)}>
                  <div>
                    <p>
                      {detail.promotionName}
                    </p>
                    <span>{detail.memo}</span>
                  </div>
                  <p className="limitPrice">
                    {currencySymbolGenerator('NTD', parseInt(detail.bonusQuota, 10))}
                  </p>
                </li>
              ))}
            </ul>

            <div className="remarkArea">標示⭐️活動之優惠利率擇優計算</div>
          </section>
        )}
      </DepositPlusWrapper>
    </Layout>
  );
};

export default Deposit;
