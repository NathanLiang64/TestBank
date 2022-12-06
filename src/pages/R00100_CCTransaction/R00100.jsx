import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { showCustomPrompt } from 'utilities/MessageModal';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import Layout from 'components/Layout/Layout';
import { MainScrollWrapper } from 'components/Layout';
import BottomAction from 'components/BottomAction';
import CreditCard from 'components/CreditCard';

import { closeFunc, loadFuncParams, startFunc } from 'utilities/AppScriptProxy';
import { FuncID } from 'utilities/FuncID';
import CreditCardTxsList from 'components/CreditCardTxsList';
import PageWrapper from './R00100.style';
import { getBankeeCard } from './api';

/**
 * R00100 信用卡 即時消費明細
 */
const R00100 = () => {
  const dispatch = useDispatch();
  const [cardInfo, setCardInfo] = useState();
  const go2Instalment = () => startFunc(FuncID.R00200, {cardNo: cardInfo.cardNo});

  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    const funcParams = await loadFuncParams();
    if (funcParams) {
      const {card, usedCardLimit} = funcParams;
      setCardInfo({...card, usedCardLimit});
    } else {
      const bankeeCardInfo = await getBankeeCard(); // 若從更多 (B00600) 頁面進入，會先確認有沒有 bankee 信用卡，
      if (bankeeCardInfo) setCardInfo(bankeeCardInfo); // 若有 bankee 信用卡，則將其卡號作為搜尋交易明細的 default 值
      else {
        await showCustomPrompt({
          message: '您尚未持有Bankee信用卡，請在系統關閉此功能後，立即申請。',
          onOk: closeFunc,
          onClose: closeFunc,
        });
      }
    }

    dispatch(setWaittingVisible(false));
  }, []);

  return (
    <Layout title="信用卡即時消費明細" goBackFunc={closeFunc}>
      <MainScrollWrapper>
        <PageWrapper>
          <div className="bg-gray">
            <CreditCard
              cardName={cardInfo?.isBankeeCard ? 'Bankee信用卡' : '所有信用卡'}
              accountNo={cardInfo?.isBankeeCard ? cardInfo.cards[0].cardNo : ''}
              balance={cardInfo?.usedCardLimit}
              color="green"
              annotation="已使用額度"
            />
          </div>
          <div className="txn-wrapper">
            {!!cardInfo && (
            <CreditCardTxsList showAll card={cardInfo} />
            ) }
          </div>
          <div className="note">實際請款金額以帳單為準</div>

          {cardInfo?.isBankeeCard && (
            <BottomAction position={0}>
              <button type="button" onClick={go2Instalment}>晚點付</button>
            </BottomAction>
          ) }
        </PageWrapper>
      </MainScrollWrapper>
    </Layout>
  );
};

export default R00100;
