import { EditIcon } from 'assets/images/icons';
import Loading from 'components/Loading';
import EmptyData from 'components/EmptyData';
import { FEIBIconButton } from 'components/elements';
import ArrowNextButton from 'components/ArrowNextButton';
import { showCustomPrompt } from 'utilities/MessageModal';
import { currencySymbolGenerator } from 'utilities/Generator';

import { useEffect, useRef, useState } from 'react';
import InformationTape from 'components/InformationTape';
import { MemoEditForm } from './memoEditForm';
import { CreditCardTxsListWrapper } from './cardTxsList.style';
import { stringDateFormat } from './utils';

/*
* ==================== TransactionsList 組件說明 ====================
* 信用卡交易明細組件
* ==================== TransactionsList 可傳參數 ====================
* 1. card -> 卡片資料
* 2. onMoreFuncClick -> 更多明細
* 3. showAll -> true:顯示所有交易明細, false: 只顯示前三筆
* 4. transactions -> 交易明細列表
* 5. onTxnNotesEdit -> 編輯交易明細的 handler
* */

const CreditCardTxsList = ({
  card,
  onMoreFuncClick,
  transactions,
  onTxnNotesEdit,
}) => {
  const ref = useRef();
  const [computedCount, setComputedCount] = useState(5); // 預設顯示五筆
  const showMoreButton = onMoreFuncClick && transactions?.length > computedCount;

  //  提交memoText
  const showMemoEditDialog = (transaction) => {
    showCustomPrompt({
      title: '編輯備註',
      message: (
        <MemoEditForm
          defaultValues={transaction}
          isBankeeCard={card.isBankeeCard}
          onTxnNotesEdit={onTxnNotesEdit}
        />
      ),
    });
  };

  // 信用卡交易明細列表
  const renderTransactionList = () => {
    if (!transactions) return <Loading space="both" isCentered />;
    if (!transactions.length) return <EmptyData content="查無交易明細" />;

    const transArr = !onMoreFuncClick ? transactions : transactions.slice(0, computedCount);

    return (
      <div className="transactionList">
        {transArr.map((transaction) => (
          <InformationTape
            key={transaction.txKey}
            topLeft="刷卡消費" // 原 transaction.txName
            topRight={currencySymbolGenerator('NTD', transaction.amount)}
            bottomLeft={(
              <p className="date-card-info">
                {stringDateFormat(transaction.txDate)}
                {!card.isBankeeCard
                && ` | 卡-${transaction.cardNo.slice(-4)}`}
              </p>
              )}
            bottomRight={(
              <div className="remark">
                <span>{transaction.note}</span>
                <FEIBIconButton onClick={() => showMemoEditDialog(transaction)}>
                  <EditIcon />
                </FEIBIconButton>
              </div>
            )}
          />
        ))}
      </div>
    );
  };

  // TODO 後續改從 utils 調用 methods
  useEffect(() => {
    // 計算可顯示的明細項目數量。
    const yPos = ref?.current?.getBoundingClientRect()?.y;
    const detailAreaHeight = yPos ? window.innerHeight - yPos : 430; // 如果沒有，預設顯示 5 筆
    // 根據剩餘高度計算要顯示的卡片數量，計算裝置可容納的交易明細卡片數量
    const counts = Math.floor((detailAreaHeight - 30) / 80);
    setComputedCount(counts);
  }, []);

  return (
    <CreditCardTxsListWrapper ref={ref}>
      {renderTransactionList()}
      {showMoreButton && (
        <ArrowNextButton onClick={onMoreFuncClick}>更多明細</ArrowNextButton>
      )}
    </CreditCardTxsListWrapper>
  );
};

export default CreditCardTxsList;
