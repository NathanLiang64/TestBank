import { useRef } from 'react';
import DetailCard from 'components/DetailCard';
import { ArrowNextIcon } from 'assets/images/icons';
import DepositDetailPanelWrapper from './depositDetailPanel.style';

const DepositDetailPanel = ({
  details, onClick,
}) => {
  const detailsRef = useRef();

  const renderDetailCardList = () => {
    if (details === null) {
      return (
        // TODO: 顯示載入中...
        <div>TODO: 顯示載入中...</div>
      );
    }

    if (details.length === 0) {
      return (
        // TODO: 顯示沒有資料的圖案
        <div>TODO: 顯示沒有資料的圖案</div>
      );
    }

    // TODO: 計算可顯示的明細項目數量。
    // TODO: 因為外層 div 已縮至最小，無法正確計算可顯示的數量。「外層」可能是 Layout 物件。
    // const { offsetHeight } = detailsRef?.current;
    // setDetailAreaHeight(offsetHeight);
    const detailAreaHeight = 430; // 暫時固定顯示 5 筆

    // 根據剩餘高度計算要顯示的卡片數量，計算裝置可容納的交易明細卡片數量
    const list = [];
    const computedCount = Math.floor((detailAreaHeight - 30) / 80);
    for (let i = 0; (i < computedCount && i < details.length); i++) {
      list.push(details[i]);
    }

    return (
      list.map((card) => (
        <DetailCard
          key={card.index}
          avatar={null} // 大頭貼路徑＋card.targetMbrId
          title={card.description}
          type={card.cdType}
          date={card.txnDate}
          time={card.txnTime}
          bizDate={card.bizDate}
          targetBank={card.targetBank}
          targetAccount={card.targetAcct}
          targetMember={card.targetMbrID}
          dollarSign={card.currency}
          amount={card.amount}
          balance={card.balance}
        />
      ))
    );
  };

  return (
    <DepositDetailPanelWrapper>
      <div className="transactionDetail" ref={detailsRef}>
        {/* 顯示 最近交易明細 */}
        { renderDetailCardList() }
        <div className="moreButton" onClick={onClick}>
          更多明細
          <ArrowNextIcon />
        </div>
      </div>
    </DepositDetailPanelWrapper>
  );
};

export default DepositDetailPanel;
