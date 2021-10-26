import { useState } from 'react';
import Dialog from 'components/Dialog';
import {
  FEIBButton, FEIBTab, FEIBTabContext, FEIBTabList,
} from 'components/elements';
import { useCheckLocation, usePageInfo } from 'hooks';
import { ArrowNextIcon } from 'assets/images/icons';
import { StarRounded } from '@material-ui/icons';
import DepositPlusWrapper, { LevelDialogContentWrapper } from './depositPlus.style';

const Deposit = () => {
  const monthly = ['12', '11', '10', '09', '08', '07', '06'];

  const [tabId, setTabId] = useState(monthly[0]);
  const [openLevelDialog, setOpenLevelDialog] = useState(false);

  useCheckLocation();
  usePageInfo('/api/depositPlus');

  const handleClickMonthTab = () => {
    // console.log('do something');
  };

  const renderLevelDialogContent = () => (
    <LevelDialogContentWrapper>
      <table className="Table">
        <caption>幣別：新臺幣</caption>
        <thead>
          <tr>
            <th>Name</th>
            <th>X Axis</th>
            <th>Y Axis</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Test Flight 1</td>
            <td>120°</td>
            <td>40°</td>
          </tr>
          <tr>
            <td>Test Flight 2</td>
            <td>120°</td>
            <td>40°</td>
          </tr>
          <tr>
            <td>Test Flight 3</td>
            <td>120°</td>
            <td>40°</td>
          </tr>
        </tbody>
      </table>
    </LevelDialogContentWrapper>
  );

  return (
    <DepositPlusWrapper>
      <FEIBTabContext value={tabId}>
        <FEIBTabList onChange={(event, id) => setTabId(id)} $size="small" className="tabList">
          { monthly.map((month) => (
            <FEIBTab key={month} label={`${month}月`} value={month} onClick={handleClickMonthTab} />
          )) }
        </FEIBTabList>
      </FEIBTabContext>

      <div className="mainArea">
        <span>2020/12 優惠利率額度總計</span>
        <h3>$5,000,000</h3>
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
            <p className="limitPrice">$1200</p>
          </li>
          <li className="listBody">
            <div>
              <p>
                2.6% 通通有
                <StarRounded className="starIcon" />
              </p>
              <span>適用活動優惠</span>
            </div>
            <p className="limitPrice">$5,000,000</p>
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
  );
};

export default Deposit;
