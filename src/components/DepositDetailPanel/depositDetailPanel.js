import { useRef } from 'react';
import DetailCard from 'components/DetailCard';
import Loading from 'components/Loading';
import EmptyData from 'components/EmptyData';
import { ArrowNextIcon } from 'assets/images/icons';
import DepositDetailPanelWrapper from './depositDetailPanel.style';

const DepositDetailPanel = ({
  details, onClick,
}) => {
  const detailsRef = useRef();

  const renderDetailCardList = () => {
    if (details === null) {
      return (
        <Loading space="both" isCentered />
      );
    }

    if (details.length === 0) {
      return (
        <div style={{ height: 500, width: '100%' }}>
          <EmptyData content="本月沒有任何活動！！" />
        </div>
      );
    }

    // 計算可顯示的明細項目數量。
    const yPos = detailsRef?.current?.getBoundingClientRect()?.y;
    const detailAreaHeight = yPos ? window.innerHeight - yPos : 430; // 如果沒有，預設顯示 5 筆

    // 根據剩餘高度計算要顯示的卡片數量，計算裝置可容納的交易明細卡片數量
    const list = [];
    // FBI-9 TODO: 因為初始時高度為0，載入後被往下推，又不會重新render，所以先減1個。
    const computedCount = Math.floor((detailAreaHeight - 30) / 80) - 1;
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
        { details?.length > 0 && (
          <div className="moreButton" onClick={onClick}>
            更多明細
            <ArrowNextIcon />
          </div>
        )}
      </div>
    </DepositDetailPanelWrapper>
  );
};

export default DepositDetailPanel;
