import React from 'react';
import { useLocation, useHistory } from 'react-router';

/* Elements */
import Layout from 'components/Layout/Layout';
import { ArrowNextIcon } from 'assets/images/icons';
import { showCustomPrompt } from 'utilities/MessageModal';
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
      showCustomPrompt({
        title: '存款優惠利率額度等級表',
        message: renderLevelDialogContent(levelList),
      });
    } else {
      window.open(url26Pa, '_blank');
    }
  };

  const ActivityCard = (data) => {
    const { title, detail } = data;

    /* 取得連結文字 */
    const detailText = detail.match(/">(.*?)<\/a>/g)[0].replace(/<\/?a>/g, '').replace(/">/g, '');

    return (
      <div className="activityCard">
        <div className="activityCard_upper">
          <div className="title">{title}</div>
          <div className="detail" onClick={async () => await handleDetailOnClick(detailText)}>
            {detailText}
            <ArrowNextIcon />
          </div>
        </div>
        <div className="activityCard_lower">
          {/* eslint-disable-next-line react/no-danger */}
          <div dangerouslySetInnerHTML={{__html: detail}} />
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
