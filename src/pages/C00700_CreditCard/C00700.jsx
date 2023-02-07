import { useEffect, useState} from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';

import { MainScrollWrapper } from 'components/Layout';
import Layout from 'components/Layout/Layout';
import CreditCard from 'components/CreditCard';
import SwiperLayout from 'components/SwiperLayout';
import CreditCardTxsList from 'components/CreditCardTxsList';
import ThreeColumnInfoPanel from 'components/ThreeColumnInfoPanel';

import { Func } from 'utilities/FuncID';
import { currencySymbolGenerator } from 'utilities/Generator';
import { loadFuncParams } from 'utilities/AppScriptProxy';
import { showCustomDrawer, showCustomPrompt, showError } from 'utilities/MessageModal';
import { R005, CreditCardIcon6, CircleIcon } from 'assets/images/icons';
import { setModalVisible, setWaittingVisible } from 'stores/reducers/ModalReducer';

import { useNavigation } from 'hooks/useNavigation';
import { getCards, getTransactionPromise, updateTxnNotes } from './api';
import {
  backInfo, generateTwoCardsArray, levelInfo, renderBody, renderHead,
} from './utils';
import {
  SwiperCreditCard,
  DetailDialogContentWrapper,
  TableDialog,
  CreditCardTxsListWrapper,
} from './C00700.style';

/**
 * C00700 信用卡 首頁
 */
const CreditCardPage = () => {
  const history = useHistory();
  const {startFunc, closeFunc} = useNavigation();
  const [cardsInfo, setCardsInfo] = useState([]);
  const [usedCardLimit, setUsedCardLimit] = useState();
  const [transactionMap, setTransactionMap] = useState({});
  const dispatch = useDispatch();

  const go2Func = (funcId, params) => {
    startFunc(funcId, params, {transactionMap, cardsInfo, usedCardLimit});
  };

  const fetchTransactions = async (cards, currentIndex) => {
    const transactionsArray = await Promise.all(
      cards.map(({ cardNo }) => getTransactionPromise(cardNo)),
    );

    const flattedTransactions = transactionsArray.flat();
    setTransactionMap((prevMap) => ({...prevMap, [currentIndex]: flattedTransactions}));
  };

  // 滑動卡片時，拿取當下信用卡的交易明細
  const onSlideChange = async (swiper) => {
    if (transactionMap[swiper.activeIndex]) return;
    const currentCards = cardsInfo[swiper.activeIndex].cards;
    fetchTransactions(currentCards, swiper.activeIndex);
  };

  // 編輯信用卡明細備註的 Handler
  const onTxnNotesEdit = async (payload, isBankeeCard) => {
    dispatch(setModalVisible(false));
    const { isSuccess, message } = await updateTxnNotes(payload);
    if (isSuccess) {
      // updateTxNotes API 打成功才更新畫面
      setTransactionMap((prevMap) => {
        const key = isBankeeCard ? 0 : 1;
        const updatedCards = prevMap[key].map((card) => (
          card.txKey === payload.txKey ? {...card, note: payload.note} : card
        ));
        return {...prevMap, [key]: updatedCards};
      });
    } else showError(message);
  };

  // 信用卡卡面右上角的功能列表
  const functionAllList = (item) => {
    const list = [
      { fid: Func.R00200.id, title: '晚點付' },
      { fid: Func.R00300.id, title: '帳單', cardNo: item.cards[0].cardNo },
      { fid: Func.R00400.id, title: '繳費', cardNo: item.isBankeeCard ? item.cards[0].cardNo : '' },
    ];
    if (!item.isBankeeCard) list.splice(0, 1);

    return (
      <ul className="functionList">
        { list.map(({fid, title, cardNo}) => (
          <li key={fid}>
            <button type="button" onClick={() => go2Func(fid, cardNo !== undefined ? {cardNo} : null)}>
              {title}
            </button>
          </li>
        ))}
      </ul>
    );
  };

  // 信用卡更多
  const handleMoreClick = (card) => {
    const list = [
      {
        fid: '/C007001', icon: <CreditCardIcon6 />, title: '信用卡資訊', param: card,
      },
      { fid: `${Func.R00500.id}`, icon: <R005 />, title: '自動扣繳' },
      { fid: '/C007002', icon: <CircleIcon />, title: '每月現金回饋' },
    ];
    const options = (
      <ul>
        {list.map((item) => (
          <li key={item.fid}>
            <button
              type="button"
              onClick={() => {
                if (item.fid.includes(Func.R00500.id)) go2Func(item.fid, null);
                else history.push(item.fid, item?.param);
              }}
            >
              {item.icon}
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    );
    showCustomDrawer({ content: options, shouldAutoClose: true });
  };

  // 信用卡卡號(產生上方內容的 slides)
  const renderSlides = () => {
    if (!cardsInfo.length) return null;
    return (
      cardsInfo.map((cardSet) => (
        <SwiperCreditCard>
          <CreditCard
            key={cardSet.cards[0].cardNo}
            cardName={cardSet.isBankeeCard ? 'Bankee信用卡' : '所有信用卡'}
            accountNo={cardSet.isBankeeCard && cardSet.cards[0].cardNo}
            balance={usedCardLimit}
            color="green"
            annotation="已使用額度"
            onMoreClicked={() => handleMoreClick(cardSet)}
            functionList={functionAllList(cardSet)}
          />
        </SwiperCreditCard>
      ))
    );
  };

  const showDialog = (title, info) => {
    showCustomPrompt({
      title,
      message: (
        <TableDialog>
          <table>
            <thead>
              <tr>
                {renderHead(info.title)}
              </tr>
            </thead>
            <tbody>
              { renderBody(info.body)}
            </tbody>
          </table>
          <span className="remark">
            ＊依個人Bankee數存月平均存款餘額核定等級
          </span>
        </TableDialog>
      ),
    });
  };

  const bonusInfo = (bankeeCard) => [
    {
      label: '會員等級',
      value: `${bankeeCard.memberLevel}`,
      iconType: 'Arrow',
      onClick: () => showDialog('會員等級', levelInfo),
    },
    {
      label: '國內/外回饋',
      value: `${bankeeCard.rewardsRateDomestic}/${bankeeCard.rewardsRateOverseas}%`,
      iconType: 'Arrow',
      onClick: () => showDialog('國內外回饋', backInfo),
    },
    {
      label: '回饋試算',
      value: currencySymbolGenerator('NTD', bankeeCard.rewardsAmount),
      iconType: 'Arrow',
      onClick: () => history.push('/C007002', { accountNo: bankeeCard.cardNo }),
    },
  ];

  // 信用卡明細總覽
  const renderCreditList = () => {
    if (!cardsInfo.length) return null;
    return (
      cardsInfo.map((cardInfo, index) => (
        <div key={cardInfo.cards[0].cardNo}>
          <DetailDialogContentWrapper>
            {cardInfo.isBankeeCard && (
            <div className="panel">
              <ThreeColumnInfoPanel content={bonusInfo(cardInfo)} />
            </div>
            )}
          </DetailDialogContentWrapper>

          <CreditCardTxsListWrapper>
            <CreditCardTxsList
              card={cardInfo}
              onMoreFuncClick={() => go2Func(Func.R00100.id, {
                card: cardInfo, usedCardLimit, transactions: transactionMap[index], index,
              })}
              transactions={transactionMap[index]}
              onTxnNotesEdit={onTxnNotesEdit}
            />
          </CreditCardTxsListWrapper>
        </div>
      ))
    );
  };

  // 拿取信用卡資訊 & 第一張卡面的交易明細
  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    const params = await loadFuncParams();
    // TODO 待調整結構
    if (params?.response) {
      setTransactionMap(params.response.transactionMap);
      setCardsInfo(params.response.cardsInfo);
      setUsedCardLimit(params.response.usedCardLimit);
    } else if (params) {
      setTransactionMap(params.transactionMap);
      setCardsInfo(params.cardsInfo);
      setUsedCardLimit(params.usedCardLimit);
    } else {
      const {cards, usedCardLimit: limit} = await getCards();
      if (cards.length) {
        const transferedCards = generateTwoCardsArray(cards);
        fetchTransactions(transferedCards[0].cards, 0);
        setCardsInfo(transferedCards);
        setUsedCardLimit(limit);
      } else {
        await showCustomPrompt({
          message: '您尚未持有Bankee信用卡，請在系統關閉此功能後，立即申請。',
          onClose: closeFunc,
        });
      }
    }
    dispatch(setWaittingVisible(false));
  }, []);

  return (
    <Layout title="信用卡" goBackFunc={closeFunc}>
      <MainScrollWrapper>
        <SwiperLayout
          slides={renderSlides()}
          hasDivider={false}
          slidesPerView={1.06}
          spaceBetween={8}
          centeredSlides
          onSlideChange={onSlideChange}
        >
          {renderCreditList()}
        </SwiperLayout>
      </MainScrollWrapper>
    </Layout>
  );
};

export default CreditCardPage;
