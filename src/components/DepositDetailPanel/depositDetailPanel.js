import { useRef } from 'react';
import DetailCard from 'components/DetailCard';
import Loading from 'components/Loading';
import EmptyData from 'components/EmptyData';
import { ArrowNextIcon } from 'assets/images/icons';
import DepositDetailPanelWrapper from './depositDetailPanel.style';

const DepositDetailPanel = ({
  details, onMoreFuncClick,
}) => {
  const detailsRef = useRef();

  const renderDetailCardList = () => {
    if (!details) {
      return (<Loading space="both" isCentered />);
    }

    if (!details.length) {
      return (
        // EmptyData圖樣在下方畫面中視覺上應垂直置中 style={{ height: 300, width: '100%' }}
        <div className="emptyDataContainer">
          <EmptyData content="查無最近三年內的帳務往來資料" />
        </div>
      );
    }

    // 可顯示明細數量限制為三筆
    const list = [];
    for (let i = 0; (i < 3 && i < details.length); i++) {
      list.push(details[i]);
    }

    return (
      list.map((txnInfo) => <DetailCard {...txnInfo} key={txnInfo.index} />)
    );
  };

  return (
    <DepositDetailPanelWrapper>
      <div className="transactionDetail" ref={detailsRef}>
        {/* 顯示 最近交易明細 */}
        { renderDetailCardList() }
        { details?.length > 0 && (
          <div className="moreButton" onClick={onMoreFuncClick}>
            更多明細
            <ArrowNextIcon />
          </div>
        )}
      </div>
    </DepositDetailPanelWrapper>
  );
};

export default DepositDetailPanel;
