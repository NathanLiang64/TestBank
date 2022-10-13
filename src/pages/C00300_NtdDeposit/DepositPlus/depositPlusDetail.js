/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';

/* Elements */
import Layout from 'components/Layout/Layout';
import { ArrowNextIcon } from 'assets/images/icons';

/* Style */
import { DepositPlusDetailWrapper } from './depositPlus.style';

export const mockData = {
  rate: '0.026',
  bonusQuota: '0',
  promotionType: 'A',
  startDate: null,
  endDate: null,
  promotionName: '社群圈優惠額度*',
  memo: '依優惠額度等級',
  brief: '●適用優惠：社群圈存款月平均餘額之總額當月達到指定門檻，推薦人次月可享活存利率加碼優惠。<br>●備註：本專案優惠與標示*活動之優惠額度採擇優計算。<br><a href="" target="_blank">優惠額度等級表</a>',
};

/**
 * DepositPlusDetail 各項活動說明
 */
const DepositPlusDetail = () => {
  console.log('C00300 DepositPlusDetail');
  const location = useLocation();

  const handleDetailOnClick = (detailText) => {
    console.log('C00300 DepositPlusDetail handleDetailOnClick detailText: ', detailText);

    if (detailText === '優惠額度等級表') {
      console.log('C00300 DepositPlusDetail handleDetailOnClick: 顯示Dialog');
    } else {
      console.log('C00300 DepositPlusDetail handleDetailOnClick: 開啟網頁');
    }
  };

  const ActivityCard = (data) => {
    console.log('C00300 DepositPlusDetail activityCard data: ', data);
    const { title, detail } = data;

    const detailText = detail.split(/[><]/).slice(-3, -2)[0];

    return (
      <div className="activityCard">
        <div className="activityCard_upper">
          <div className="title">{title}</div>
          <div className="detail" onClick={() => handleDetailOnClick(detailText)}>
            {detailText}
            <ArrowNextIcon />
          </div>
        </div>
        <div className="activityCard_lower">
          <div dangerouslySetInnerHTML={{__html: detail}} />
        </div>
      </div>
    );
  };

  return (
    <DepositPlusDetailWrapper>
      <Layout title="各項活動說明">
        <ActivityCard title={mockData.promotionName} detail={mockData.brief} />
      </Layout>
    </DepositPlusDetailWrapper>
  );
};

export default DepositPlusDetail;
