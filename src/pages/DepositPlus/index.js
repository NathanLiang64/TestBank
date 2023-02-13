/* eslint-disable no-use-before-define */
import { useHistory } from 'react-router';
import { useEffect, useReducer, useState } from 'react';
import { useDispatch } from 'react-redux';
import uuid from 'react-uuid';
import { getThisMonth } from 'utilities/MonthGenerator';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';

/* Elements */
import Layout from 'components/Layout/Layout';
import {
  FEIBTab, FEIBTabContext, FEIBTabList,
} from 'components/elements';

/* Reducers & JS functions */
import { ArrowNextIcon } from 'assets/images/icons';
import { currencySymbolGenerator } from 'utilities/Generator';
import { getBonusPeriodList } from './api';
import DepositPlusWrapper from './depositPlus.style';
import { getDepositPlus } from './utils';

/**
 * DepositPlus 優惠利率額度 // TODO 即然與帳戶無關，應獨立為一個單元功能。
 */
const Deposit = (props) => {
  const { location } = props;
  const { state } = location;
  console.log(state);

  const dispatch = useDispatch();
  const history = useHistory();
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const [model] = useState(state ?? {
    monthList: {},
    selectedMonth: null,
    levelList: {}, // 用來保存各年度優惠利率額度等級表資訊。
  });
  const current = model.monthList[model.selectedMonth];

  useEffect(async () => {
    if (state) return; // 從 Detail 返回，已經有資料了，不用再重載。

    dispatch(setWaittingVisible(true));
    getBonusPeriodList().then((response) => {
      if (!response.length) response = [getThisMonth()]; // 如果沒有回傳資料，顯示系統年月
      let nearestMonth = response.at(0);
      response.forEach((month) => {
        model.monthList[month] = {
          yearly: month.substring(0, 4),
          month: month.substring(4, 6),
          data: null,
        };
        if (month > nearestMonth) nearestMonth = month;
      });
      setCurrentMonth(nearestMonth);
    }).finally(() => {
      dispatch(setWaittingVisible(false));
    });
  }, []);

  // 切換頁籤時，才會取當下月份的資料
  const setCurrentMonth = async (month) => {
    model.selectedMonth = month;
    if (!model.monthList[month].data) {
      // 依照所選月份取得資料並儲存在map中
      getDepositPlus(month).then((data) => {
        model.monthList[month].data = data;
        forceUpdate();
      });
    }
  };

  const renderTabArea = (monthList) => (
    <FEIBTabContext value={model.selectedMonth}>
      <FEIBTabList onChange={(event, id) => setCurrentMonth(id)} $size="small" className="tabList" $isSingleTab={monthList.length === 1}>
        { Object.entries(monthList).sort((a, b) => b[0] - a[0]).map((entry) => (
          <FEIBTab key={entry[0]} label={`${entry[1].month}月`} value={entry[0]} />
        )) }
      </FEIBTabList>
    </FEIBTabContext>
  );

  return (
    <Layout title="優惠利率額度">
      <DepositPlusWrapper>
        {renderTabArea(model.monthList)}

        {current ? (
          <>
            <div className="mainArea">
              <span>
                {`${current.yearly}/${current.month}`}
                優惠利率額度總計
              </span>
              <h3>{currencySymbolGenerator('NTD', current.data?.summaryBonusQuota ?? '--')}</h3>
            </div>

            <section className="detailArea">
              <div className="sectionTitle">
                <h3>活動明細</h3>
                {current.data?.bonusDetail.length && (
                <button type="button" onClick={() => history.push('/depositPlusDetail', model)}>
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
                {current.data?.bonusDetail.map((detail) => (
                  <li className="listBody" key={uuid()}>
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
          </>
        ) : (
          <div>
            {/* TODO 說明沒有任何資料的原因，導客到活動網址讓用戶知道，吸引其參加 */}
          </div>
        )}
      </DepositPlusWrapper>
    </Layout>
  );
};

export default Deposit;
