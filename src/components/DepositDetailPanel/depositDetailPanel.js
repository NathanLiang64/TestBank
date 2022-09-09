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
        <div style={{ height: 500, width: '100%' }}>
          <EmptyData content="查無最近三年內的帳務往來資料" />
        </div>
      );
    }

    // 計算可顯示的明細項目數量。
    const yPos = detailsRef?.current?.getBoundingClientRect()?.y;
    const detailAreaHeight = yPos ? window.innerHeight - yPos : 430; // 如果沒有，預設顯示 5 筆

    // 根據剩餘高度計算要顯示的卡片數量，計算裝置可容納的交易明細卡片數量
    const list = [];
    const computedCount = Math.floor((detailAreaHeight - 30) / 80);
    for (let i = 0; (i < computedCount && i < details.length); i++) {
      list.push(details[i]);
    }

    return (
      list.map((txnInfo) => (
        <DetailCard
          key={txnInfo.index}
          avatar={null} // 大頭貼路徑＋card.targetMbrId
          title={txnInfo.description}
          type={txnInfo.cdType}
          date={txnInfo.txnDate}
          time={txnInfo.txnTime}
          bizDate={txnInfo.bizDate}
          targetBank={txnInfo.targetBank}
          targetAccount={txnInfo.targetAcct}
          targetMember={txnInfo.targetMbrID}
          dollarSign={txnInfo.currency}
          amount={txnInfo.amount}
          balance={txnInfo.balance}
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
