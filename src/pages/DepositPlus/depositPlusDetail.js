import React from 'react';
import { useHistory } from 'react-router';
import uuid from 'react-uuid';

/* Elements */
import Layout from 'components/Layout/Layout';
import { ArrowNextIcon } from 'assets/images/icons';
import { showCustomPrompt } from 'utilities/MessageModal';
import { switchZhNumber } from 'utilities/Generator';
import { getDepositPlusLevelList } from './api';

/* Style */
import { DepositPlusDetailWrapper, LevelDialogContentWrapper } from './depositPlus.style';

/**
 * DepositPlusDetail 各項活動說明
 */
const DepositPlusDetail = (props) => {
  const { location } = props;
  const { state } = location;

  const history = useHistory();

  const model = state;
  const current = model.monthList[model.selectedMonth];

  // 調整優惠列表中的數字顯示
  const handleLevelList = (list) => list.map((item, index) => {
    const {baseAmount, maxAmount, quota} = item;
    let rangeText = '';

    if (index === 0) {
      rangeText = `${switchZhNumber(maxAmount + 1, false)}(不含) 以下`;
    } else if (index === 13) {
      rangeText = `${switchZhNumber(baseAmount, false)}(含) 以上`;
    } else {
      rangeText = `${switchZhNumber(baseAmount, false)}(含) ~${switchZhNumber(maxAmount + 1, false)}`;
    }

    /* quota: 推薦人個人優惠利率存款額度數字 */
    const quotaText = (quota === 0) ? '0' : `${switchZhNumber(quota, true)}(含)`;

    const newItem = {
      level: item.level,
      range: rangeText,
      quota: quotaText,
    };

    return newItem;
  });

  const renderLevelDialogContent = (levelList) => (
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
            const { level, range, quota } = item;
            return (
              <tr key={level}>
                <td>{level}</td>
                <td>{range}</td>
                <td>{quota}</td>
              </tr>
            );
          }) }
        </tbody>
      </table>
    </LevelDialogContentWrapper>
  );

  const handleDetailOnClick = async (detailText, url) => {
    if (detailText === '優惠額度等級表') { // TODO 不可用名稱，改用 promotionCode
      const {yearly} = current;
      // 優惠利率額度等級表，點開彈窗再撈取資料
      // 如果已有資料則不再重複撈取資料
      if (!model.levelList[yearly]) {
        const response = await getDepositPlusLevelList(yearly);
        model.levelList[yearly] = response ?? [];
      }

      const adjustedLevelList = handleLevelList(model.levelList[yearly]);

      showCustomPrompt({
        title: '存款優惠利率額度等級表',
        message: renderLevelDialogContent(adjustedLevelList),
      });
    } else {
      window.open(url, '_blank');
    }
  };

  const ActivityCard = (data) => {
    const { detail } = data;

    /* 取得標題、內容、按鈕文字、外開網頁url */
    const {
      promotionName, detailLinkText, detailUrl, brief,
    } = detail;

    return (
      <div className="activityCard">
        <div className="activityCard_upper">
          <div className="title">{promotionName.replace('⭐️', '')}</div>
          <div className="detail" onClick={() => handleDetailOnClick(detailLinkText, detailUrl)}>
            {detailLinkText}
            <ArrowNextIcon />
          </div>
        </div>
        {/* eslint-disable-next-line react/no-danger */}
        <div className="activityCard_lower" dangerouslySetInnerHTML={{__html: brief}} />
      </div>
    );
  };

  return (
    <DepositPlusDetailWrapper>
      <Layout title="各項活動說明" goBackFunc={() => history.replace('/depositPlus', model)}>
        <div>
          {current.data.bonusDetail.map((detail) => (
            <ActivityCard key={uuid()} detail={detail} />
          ))}
        </div>
      </Layout>
    </DepositPlusDetailWrapper>
  );
};

export default DepositPlusDetail;
