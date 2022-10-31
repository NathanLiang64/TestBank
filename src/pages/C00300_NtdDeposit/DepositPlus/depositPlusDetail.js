import React from 'react';
import { useLocation, useHistory } from 'react-router';

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
const DepositPlusDetail = () => {
  const location = useLocation();
  const history = useHistory();

  const url26Pa = 'https://www.bankee.com.tw/event/26Pa/index.html';

  // 調整優惠列表中的數字顯示
  const handleLevelList = (list) => list.map((item, index) => {
  // offlineDepositRange
    const offlineDepositRange = item.offlineDepositRange.replace(/,/g, '');
    const offlineDepositRangeNum = {
      firstNum: offlineDepositRange.match(/\d+/g)[0],
      secondNum: offlineDepositRange.match(/\d+/g)[1],
    };
    const offlineDepositRangeInt = {
      firstNum: parseInt(offlineDepositRangeNum.firstNum, 10),
      secondNum: parseInt(offlineDepositRangeNum.secondNum, 10),
    };
    let offlineDepositRangeFinalRes = '';

    if (index === 0) {
      offlineDepositRangeFinalRes = `${switchZhNumber(offlineDepositRangeInt.firstNum, false)}(不含) 以下`;
    } else if (index === 13) {
      offlineDepositRangeFinalRes = `${switchZhNumber(offlineDepositRangeInt.firstNum, false)}(含) 以上`;
    } else {
      offlineDepositRangeFinalRes = `${switchZhNumber(offlineDepositRangeInt.firstNum, false)
      }(含) ~${
        switchZhNumber(offlineDepositRangeInt.secondNum, false)}`;
    }

    // plus
    const plus = item.plus.replace(/,/g, '');
    const plusFinalRes = parseInt(plus, 10) === 0
      ? '0'
      : `${switchZhNumber(parseInt(plus, 10), true)}(含)`;

    const newItem = {
      ...item,
      plus: plusFinalRes,
      offlineDepositRange: offlineDepositRangeFinalRes,
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

  const handleDetailOnClick = async (detailText) => {
    if (detailText === '優惠額度等級表') {
      const { year } = location.state;
      const levelList = await getDepositPlusLevelList({ year });
      const adjustedLevelList = handleLevelList(levelList);
      showCustomPrompt({
        title: '存款優惠利率額度等級表',
        message: renderLevelDialogContent(adjustedLevelList),
      });
    } else {
      window.open(url26Pa, '_blank');
    }
  };

  const ActivityCard = (data) => {
    const { title, detail } = data;

    /* 取得連結文字 */
    const detailLinkText = detail.match(/">(.*?)<\/a>/g)[0].replace(/<\/?a>/g, '').replace(/">/g, '');

    /* 移除<a>，將字串依換行符號切成字串陣列，移除所有'●' */
    const aTagRemovedDetail = detail.replace(/<a(.*?)<\/a>/g, '').replaceAll('●', '');

    const detailList = aTagRemovedDetail.split('<br>');

    return (
      <div className="activityCard">
        <div className="activityCard_upper">
          <div className="title">{title}</div>
          <div className="detail" onClick={async () => await handleDetailOnClick(detailLinkText)}>
            {detailLinkText}
            <ArrowNextIcon />
          </div>
        </div>
        <div className="activityCard_lower">
          {detailList.map((item) => <p key={item}>{item}</p>)}
        </div>
      </div>
    );
  };

  return (
    <DepositPlusDetailWrapper>
      <Layout title="各項活動說明" goBackFunc={() => history.goBack()}>
        <div>
          {location.state.bonusDetail.map((detail) => (
            <ActivityCard key={detail} title={detail.promotionName} detail={detail.brief} />
          ))}
        </div>
      </Layout>
    </DepositPlusDetailWrapper>
  );
};

export default DepositPlusDetail;
