import { useEffect, useState} from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';

import Layout from 'components/Layout/Layout';
import SwiperLayout from 'components/SwiperLayout';
import Main from 'components/Layout';
import CreditCard from 'components/CreditCard';

import { CreditCardIcon5, CreditCardIcon6, CircleIcon } from 'assets/images/icons';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { showCustomDrawer, showCustomPrompt, showPrompt } from 'utilities/MessageModal';

import { closeFunc, startFunc } from 'utilities/AppScriptProxy';
import { FuncID } from 'utilities/FuncID';
import { currencySymbolGenerator } from 'utilities/Generator';
import ThreeColumnInfoPanel from 'components/ThreeColumnInfoPanel';
import TransactionsList from 'components/TransactionsList';
import { getCards } from './api';
import {SwiperCreditCard, DetailDialogContentWrapper, TableDialog} from './C00700.style';
import {
  backInfo, levelInfo, renderBody, renderHead,
} from './utils';

/**
 * C00700 信用卡 首頁
 */
const CreditCardPage = () => {
  const history = useHistory();
  const [cards, setCards] = useState([]);
  const [usedCardLimit, setUsedCardLimit] = useState(0);
  const dispatch = useDispatch();
  /**
   * 頁面啟動，初始化
   */
  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    const cardResponse = await getCards(); // 若沒有信用卡資訊時，code 還會是0000嗎？
    if (!cardResponse.data || cardResponse.data.cards.length === 0) {
      await showPrompt('您尚未持有Bankee信用卡，請在系統關閉此功能後，立即申請。', closeFunc);
    }

    setCards(cardResponse.data.cards);
    setUsedCardLimit(cardResponse.data.usedCardLimit);
    dispatch(setWaittingVisible(false));
  }, []);

  // render 功能列表
  const functionAllList = (item) => {
    const list = [
      { fid: FuncID.R00200, title: '晚點付', cardNo: item.cardNo },
      { fid: FuncID.R00300, title: '帳單', cardNo: item.cardNo },
      { fid: FuncID.R00400, title: '繳費', cardNo: item.cardNo },
    ];
    if (item.isBankeeCard === 'N') list.splice(0, 1);

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
                if (item.fid.includes(FuncID.R00500)) {
                  startFunc(item.fid);
                } else {
                  history.push(item.fid, item?.param);
                }
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
    if (!cards.length) return null;

    return (
      cards.map((card) => (
        <SwiperCreditCard>
          <CreditCard
            key={card.cardNo}
            cardName={card.isBankeeCard === 'Y' ? 'Bankee信用卡' : '所有信用卡'}
            accountNo={card.isBankeeCard === 'Y' && card.cardNo}
            balance={usedCardLimit}
            color="green"
            annotation="已使用額度"
            onMoreClicked={() => handleMoreClick(card)}
            functionList={functionAllList(card)}
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

  const bonusInfo = (card) => [
    {
      label: '會員等級',
      value: `${card.memberLevel}`,
      iconType: 'Arrow',
      onClick: () => {
        showDialog('會員等級', levelInfo);
      },
    },
    {
      label: '國內/外回饋',
      value: `${card.rewardsRateDomestic}/${card.rewardsRateOverseas}%`,
      iconType: 'Arrow',
      onClick: () => {
        showDialog('國內外回饋', backInfo);
      },
    },
    {
      label: '回饋試算',
      value: `${currencySymbolGenerator('TWD')}${card.rewardsAmount}`,
      iconType: 'Arrow',
      onClick: () => history.push('/C007002', { accountNo: card.cardNo }),
    },
  ];

  // 信用卡明細總覽
  const renderCreditList = () => {
    if (!cards.length) return null;
    return (
      cards.map((card) => (
        <div key={card.cardNo}>
          <DetailDialogContentWrapper>
            {card.isBankeeCard === 'Y' && (
            <div className="panel">
              <ThreeColumnInfoPanel content={bonusInfo(card)} />
            </div>
            )}
          </DetailDialogContentWrapper>
          <TransactionsList
            showAll={false}
            card={card}
            go2MoreDetails={() => startFunc('R00100', {card, usedCardLimit})}
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
