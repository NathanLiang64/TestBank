import { EditIcon } from 'assets/images/icons';
import Loading from 'components/Loading';
import EmptyData from 'components/EmptyData';
import { FEIBIconButton } from 'components/elements';
import ArrowNextButton from 'components/ArrowNextButton';
import { showCustomPrompt } from 'utilities/MessageModal';
import { currencySymbolGenerator } from 'utilities/Generator';

import { MemoEditForm } from './memoEditForm';
import { DetailCardWrapper } from './cardTxsList.style';
import { creditNumberFormat, stringDateFormat } from './utils';

/*
* ==================== TransactionsList 組件說明 ====================
* 信用卡交易明細組件
* ==================== TransactionsList 可傳參數 ====================
* 1. card -> 卡片資料
* 2. go2MoreDetails -> 更多明細
* 3. showAll -> true:顯示所有交易明細, false: 只顯示前三筆
* 4. transactions -> 交易明細列表
* 5. onTxnNotesEdit -> 編輯交易明細的 handler
* */

const CreditCardTxsList = ({
  card,
  go2MoreDetails,
  showAll,
  transactions,
  onTxnNotesEdit,
}) => {
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

    const transArr = showAll ? transactions : transactions.slice(0, 3); // 至多只輸出三筆資料
    return (
      <div style={{ paddingTop: '2.5rem' }}>
        {transArr.map((transaction) => (
          <DetailCardWrapper key={transaction.txKey} noShadow>
            <div className="description">
              <h4>{transaction.txName}</h4>
              <p>
                {stringDateFormat(transaction.txDate)}
                {!card.isBankeeCard
                  && ` | 卡-${creditNumberFormat(transaction.cardNo)}`}
              </p>
            </div>
            <div className="amount">
              <h4>{currencySymbolGenerator('NTD', transaction.amount)}</h4>
              <div className="remark">
                <span>{transaction.note}</span>
                <FEIBIconButton
                  $fontSize={1.6}
                  onClick={() => showMemoEditDialog(transaction)}
                  className="badIcon"
                >
                  <EditIcon />
                </FEIBIconButton>
              </div>
            </div>
          </DetailCardWrapper>
        ))}
      </div>
    );
  };

  return (
    <>
      {renderTransactionList()}
      {!!go2MoreDetails && transactions?.length > 3 && (
        <ArrowNextButton onClick={go2MoreDetails}>更多明細</ArrowNextButton>
      )}
    </>
  );
};

export default CreditCardTxsList;
