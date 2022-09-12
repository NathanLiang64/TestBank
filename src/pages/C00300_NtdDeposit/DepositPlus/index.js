import { useEffect, useState } from 'react';
import { StarRounded } from '@material-ui/icons';

/* Elements */
import Layout from 'components/Layout/Layout';
import Dialog from 'components/Dialog';
import {
  FEIBButton, FEIBTab, FEIBTabContext, FEIBTabList,
} from 'components/elements';

/* Reducers & JS functions */
import { useCheckLocation, usePageInfo } from 'hooks';
import { ArrowNextIcon } from 'assets/images/icons';
import { getBonusPeriodList, getDepositPlus, getDepositPlusLevelList } from './api';
import DepositPlusWrapper, { LevelDialogContentWrapper } from './depositPlus.style';

const Deposit = () => {
  const [tabId, setTabId] = useState('');
  const [monthly, setMonthly] = useState([]);
  const [levelList, setLevelList] = useState([]);
  const [openLevelDialog, setOpenLevelDialog] = useState(false);
  const [depositPlusDetail, setDepositPlusDetail] = useState({});

  const {
    period, bonusDetail, summaryRate, summaryBonusQuota,
  } = depositPlusDetail;

  const renderText = (value) => value || '-';

  const renderLevelDialogContent = () => (
    <LevelDialogContentWrapper>
      <table>
        <caption>幣別：新臺幣（元）</caption>
        <thead>
          <tr>
            <th>等級</th>
            <th>
              社群圈存款
              <br />
              月平均餘額之總額
            </th>
            <th>
              推薦人個人
              <br />
              優惠利率存款額度
            </th>
          </tr>
        </thead>
        <tbody className="rowCenter1 rowRight2 rowRight3">
          { levelList.map((item) => {
            const { range, offlineDepositRange, plus } = item;
            return (
              <tr key={range}>
                <td>{range}</td>
                <td>{offlineDepositRange}</td>
                <td>{plus}</td>
              </tr>
            );
          }) }
        </tbody>
      </table>
    </LevelDialogContentWrapper>
  );

  const renderMonthlyTabs = (list) => list.map((month) => (
    <FEIBTab key={month} label={`${month.substr(4)}月`} value={month} />
  ));

  const renderTabArea = (monthList) => (
    <FEIBTabContext value={tabId}>
      <FEIBTabList onChange={(event, id) => setTabId(id)} $size="small" className="tabList">
        { renderMonthlyTabs(monthList) }
      </FEIBTabList>
    </FEIBTabContext>
  );

  useCheckLocation();
  usePageInfo('/api/depositPlus');

  useEffect(() => {
    getBonusPeriodList({})
      .then((response) => {
        const sortedMonthly = response?.sort((a, b) => b - a);
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
  }, [openLevelDialog, levelList.length]);

  return (
    <Layout title="優惠利率額度">
      <DepositPlusWrapper>
        { tabId && monthly.length && renderTabArea(monthly) }

        <div className="mainArea">
          <span>
            {`${renderText(period?.substr(0, 4))}/${renderText(period?.substr(4))} `}
            優惠利率額度總計
          </span>
          <h3>{`$${renderText(summaryBonusQuota)}`}</h3>
        </div>

        <section className="detailArea">
          <div className="sectionTitle">
            <h3>活動明細</h3>
            <button type="button" onClick={() => setOpenLevelDialog(true)}>
              各項活動說明
              <ArrowNextIcon />
            </button>
          </div>

          <ul className="detailList">
            <li className="listHead">
              <span>活動名稱/說明</span>
              <span>優惠定額上限</span>
            </li>
            <li className="listBody">
              <div>
                <p>社群圈優惠額度</p>
                <span>依優惠額度等級</span>
              </div>
              <p className="limitPrice">
                {`$${bonusDetail?.length ? bonusDetail[0].bonusQuota : '-'}`}
              </p>
            </li>
            <li className="listBody">
              <div>
                <p>
                  {`${renderText(summaryRate * 100)}% 通通有`}
                  <StarRounded className="starIcon" />
                </p>
                {/* TODO 改為「優惠到期日：」 */}
                <span>優惠到期日：</span>
              </div>
              <p className="limitPrice">{`$${renderText(summaryBonusQuota)}`}</p>
            </li>
          </ul>

          <div className="remarkArea">
            <span>標示</span>
            <StarRounded className="starIcon" />
            <span>活動之優惠利率擇優計算</span>
          </div>
        </section>

        <Dialog
          isOpen={openLevelDialog}
          title="優惠利率額度等級"
          onClose={() => setOpenLevelDialog(false)}
          content={renderLevelDialogContent()}
          action={<FEIBButton onClick={() => setOpenLevelDialog(false)}>確定</FEIBButton>}
        />
      </DepositPlusWrapper>
    </Layout>
  );
};

export default Deposit;
