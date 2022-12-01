import { useEffect, useState} from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';

import Main from 'components/Layout';
import Layout from 'components/Layout/Layout';
import CreditCard from 'components/CreditCard';
import SwiperLayout from 'components/SwiperLayout';
import CreditCardTxsList from 'components/CreditCardTxsList';
import ThreeColumnInfoPanel from 'components/ThreeColumnInfoPanel';

import { FuncID } from 'utilities/FuncID';
import { currencySymbolGenerator } from 'utilities/Generator';
import { closeFunc, startFunc } from 'utilities/AppScriptProxy';
import { showCustomDrawer, showCustomPrompt } from 'utilities/MessageModal';
import { CreditCardIcon5, CreditCardIcon6, CircleIcon } from 'assets/images/icons';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';

import { getCards } from './api';
import {
  backInfo, levelInfo, renderBody, renderHead,
} from './utils';
import {SwiperCreditCard, DetailDialogContentWrapper, TableDialog} from './C00700.style';

/**
 * C00700 信用卡 首頁
 */
const CreditCardPage = () => {
  const history = useHistory();
  const [cardsInfo, setCardsInfo] = useState([]);
  const [usedCardLimit, setUsedCardLimit] = useState();
  const dispatch = useDispatch();

  // 拿取信用卡資訊
  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    const cardRes = await getCards();
    if (!cardRes.data.cards.length) {
      await showCustomPrompt({
        message: '您尚未持有Bankee信用卡，請在系統關閉此功能後，立即申請。',
        onClose: closeFunc,
      });
    }
    // 拿到 cardRes.data.cards 後，將其結構轉成
    //   {
    //     isBankeeCard: boolean;
    //     cards: { cardNo: string }[];
    //     memberLevel: number|null;
    //     rewardsRateDomestic: number|null;
    //     rewardsRateOverseas: number|null;
    //     rewardsAmount: number|null;
    //   }[]

    const data = cardRes.data.cards.reduce((acc, cur) => {
      const {isBankeeCard, cardNo, ...rest} = cur;

      if (isBankeeCard === 'Y') {
        acc.push({...rest, isBankeeCard: true, cards: [{cardNo}]});
      } else if (isBankeeCard === 'N') {
        if (acc.length) {
          const foundIndex = acc.findIndex((item) => !item.isBankeeCard);
          if (foundIndex >= 0) acc[foundIndex].cards.push({cardNo});
          else acc.push({ isBankeeCard: false, cards: [{cardNo}]});
        } else acc.push({ isBankeeCard: false, cards: [{cardNo}]});
      }

      return acc;
    }, []);

    // 若第一個項目是 「所有信用卡」，則將順序對調
    if (data.length === 2 && !data[0].isBankeeCard) [data[0], data[1]] = [data[1], data[0]];

    setCardsInfo(data);
    setUsedCardLimit(cardRes.data.usedCardLimit);
    dispatch(setWaittingVisible(false));
  }, []);

  // 信用卡卡面右上角的功能列表
  const functionAllList = (item) => {
    const list = [
      { fid: FuncID.R00200, title: '晚點付', cardNo: item.cards[0].cardNo },
      { fid: FuncID.R00300, title: '帳單', cardNo: item.cards[0].cardNo },
      { fid: FuncID.R00400, title: '繳費', cardNo: item.isBankeeCard ? item.cards[0].cardNo : '' },
    ];
    if (!item.isBankeeCard) list.splice(0, 1);

    return (
      <ul className="functionList">
        { list.map((func) => (
          <li key={func.fid}>
            <button type="button" onClick={() => startFunc(func.fid, { cardNo: func.cardNo })}>
              {func.title}
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
      { fid: `/${FuncID.R00500}`, icon: <CreditCardIcon5 />, title: '自動扣繳' },
      { fid: '/C007002', icon: <CircleIcon />, title: '每月現金回饋' },
    ];
    const options = (
      <ul>
        {list.map((item) => (
          <li key={item.fid}>
            <button
              type="button"
              onClick={() => {
                if (item.fid.includes(FuncID.R00500)) startFunc(item.fid);
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
      value: `${currencySymbolGenerator('TWD')}${bankeeCard.rewardsAmount}`,
      iconType: 'Arrow',
      onClick: () => history.push('/C007002', { accountNo: bankeeCard.cardNo }),
    },
  ];

  // 信用卡明細總覽
  const renderCreditList = () => {
    if (!cardsInfo.length) return null;
    return (
      cardsInfo.map((cardSet) => (
        <div key={cardSet.cards[0].cardNo}>
          <DetailDialogContentWrapper>
            {cardSet.isBankeeCard && (
            <div className="panel">
              <ThreeColumnInfoPanel content={bonusInfo(cardSet)} />
            </div>
            )}
          </DetailDialogContentWrapper>
          <CreditCardTxsList
            showAll={false}
            card={cardSet}
            go2MoreDetails={() => startFunc('R00100', {cardSet, usedCardLimit})}
          />
        </div>
      ))
    );
  };

  return (
    <Layout title="信用卡" goBackFunc={closeFunc}>
      <Main small>
        <SwiperLayout slides={renderSlides()} hasDivider={false} slidesPerView={1.06}>
          {renderCreditList()}
        </SwiperLayout>
      </Main>
    </Layout>
  );
};

export default CreditCardPage;
