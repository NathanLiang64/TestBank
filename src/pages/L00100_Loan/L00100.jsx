/* eslint react/no-array-index-key: 0 */

import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import uuid from 'react-uuid';

import { setDrawer, setDrawerVisible, setWaittingVisible } from 'stores/reducers/ModalReducer';

import { CircleIcon, MoreIcon, ArrowNextIcon } from 'assets/images/icons';
import { MainScrollWrapper } from 'components/Layout';
import Layout from 'components/Layout/Layout';
import SwiperLayout from 'components/SwiperLayout';
import AccountCard from 'components/AccountCard';
import FEIBIconButton from 'components/elements/FEIBIconButton';
import ThreeColumnInfoPanel from 'components/ThreeColumnInfoPanel';
import InformationTape from 'components/InformationTape';
import EmptyData from 'components/EmptyData';
import {
  accountFormatter, dateFormatter, stringToDate, currencySymbolGenerator, stringDateCodeFormatter,
} from 'utilities/Generator';

import { showPrompt } from 'utilities/MessageModal';
import { closeFunc, startFunc } from 'utilities/AppScriptProxy';
import { FuncID } from 'utilities/FuncID';
import { getLoanSummary, getContract, getSubPaymentHistory } from './api';
// import { getLoanSummary, getContract, getStatment } from './api';
import PageWrapper, { ContentWrapper } from './L00100.style';

const uid = uuid();

/**
 * L00100 貸款 首頁
 */
const Page = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [loans, setLoans] = useState();

  /**
   * 初始化貸款資料載入
   */
  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    const response = await getLoanSummary();

    // 若無資料，跳出彈窗後關閉頁面
    if (response.length === 0) {
      await showPrompt('您尚未擁有貸款，請在系統關閉此功能後，立即申請。', () => closeFunc());
    } else {
      setLoans(response);
    }

    dispatch(setWaittingVisible(false));
  }, []);

  /**
   * 產生上方卡片會用到的
   */
  const handleMoreClick = (accountNo) => {
    const list = [
      { icon: <CircleIcon />, title: '貸款資訊', onClick: () => { history.push('/L001002', { accountNo }); } },
      /*
      { icon: <CircleIcon />, title: '部分貸款', onClick: () => {} },
      { icon: <CircleIcon />, title: '全部貸款', onClick: () => {} },
      */
      { icon: <CircleIcon />, title: '合約下載', onClick: () => { getContract({ accountNo, format: 1 }); } },
      /*
      { icon: <CircleIcon />, title: '清償證明下載', onClick: () => { getStatment({ accountNo, format: 1 }); } },
      */
    ];
    dispatch(setDrawer({
      title: '',
      content: (
        <ul>
          {list.map((func) => (
            <li key={func.title}>
              <button type="button" onClick={func.onClick}>
                {func.icon}
                {func.title}
              </button>
            </li>
          ))}
        </ul>
      ),
      shouldAutoClose: true,
    }));
    dispatch(setDrawerVisible(true));
  };

  const handleSearchClick = (accountNo) => {
    // 查詢應繳本息
    startFunc(FuncID.L00200, { accountNo });
  };

  /**
   * 產生上方卡片的 slides
   */
  const renderSlides = (cards) => {
    if (!cards || cards?.length === 0) return [];

    return cards.map((card, i) => (
      <AccountCard type="L" key={`${uid}-c${i}`}>
        <div className="justify-between items-start">
          <div>
            <div>{card.alias ?? '貸款'}</div>
            <div>{`${accountFormatter(card.accountNo)} (${card.loanNo})`}</div>
          </div>
          <FEIBIconButton className="-mt-5 -mr-5" aria-label="展開下拉式選單" onClick={() => handleMoreClick(card.accountNo)}>
            <MoreIcon />
          </FEIBIconButton>
        </div>
        <div className="justify-end items-baseline gap-4">
          <div>貸款餘額</div>
          <div className="balance">{currencySymbolGenerator(card.currency ?? 'NTD', card.balance)}</div>
        </div>
        <div className="justify-end gap-6 mt-4 divider">
          <button type="button" className="text-16" onClick={() => handleSearchClick(card.accountNo)}>本期應繳查詢</button>
        </div>
      </AccountCard>
    ));
  };

  /**
   * 產生下方資訊會用到的
   */
  const renderBonusContents = (info, accountNo) => ([
    {
      label: '應繳款日',
      value: `每月${info.cycleTiming}日`,
      onClick: () => handleSearchClick(accountNo),
    },
    {
      label: '應繳本息',
      value: currencySymbolGenerator(info.currency ?? 'NTD', info.interest),
      onClick: () => handleSearchClick(accountNo),
    },
    {
      label: '可能回饋',
      value: '-',
    },
    /*
    {
      label: '可能回饋',
      value: info.isJoinedRewardProgram ? currencySymbolGenerator(info.currency ?? 'NTD', info.rewards) : '-',
      onClick: () => history.push('/L001001', { accountNo }),
    },
    */
  ]);

  const handleSingleTransaction = async (i, cardData) => {
    dispatch(setWaittingVisible(true));
    const param = {
      account: cardData.accountNo,
      subNo: cardData.loanNo,
      startDate: stringDateCodeFormatter(new Date(new Date().setDate(new Date().getDate() - 30))),
      endDate: stringDateCodeFormatter(new Date()),
    };
    const historyResponse = await getSubPaymentHistory(param);
    dispatch(setWaittingVisible(false));
    if (historyResponse) {
      const singleHistoryData = historyResponse[i];
      startFunc(FuncID.L00300 + 1, { singleHistoryData, cardData });
    }
  };

  const renderTransactions = (card) => {
    if (card?.transactions?.length <= 0) {
      return (
        <div style={{ height: '20rem', marginTop: '6rem' }}>
          <EmptyData />
        </div>
      );
    }

    return card.transactions.slice(0, 3).map((t, i) => (
      <button
        key={`${uid}-t${i}`}
        type="button"
        aria-label={`點擊查詢此筆紀錄，還款日:${dateFormatter(stringToDate(t.txnDate))}，金額：${currencySymbolGenerator(t.currency ?? 'NTD', t.amount)}`}
        onClick={() => handleSingleTransaction(i, card)}
        style={{ width: '100%' }}
      >
        <InformationTape
          topLeft="還款金額"
          bottomLeft={dateFormatter(stringToDate(t.txnDate))}
          topRight={currencySymbolGenerator(t.currency ?? 'NTD', t.amount)}
          bottomRight={`貸款餘額 ${currencySymbolGenerator(t.currency ?? 'NTD', t.amount)}`}
        />
      </button>
    ));
  };

  const handleMoreTransactionsClick = (card) => {
    startFunc(FuncID.L00300, { card });
  };

  /**
   * 產生下方交易資訊的 slides
   */
  const renderContents = (cards) => {
    if (!cards || cards?.length === 0) return [];

    return cards.map((card, i) => (
      <ContentWrapper key={`${uid}-a${i}`}>
        <ThreeColumnInfoPanel content={renderBonusContents(card.bonusInfo, card.accountNo)} />
        <div>
          <div>{ renderTransactions(card) }</div>
          <div className="toolbar">
            <button className="btn-icon" type="button" onClick={() => handleMoreTransactionsClick(card)}>
              更多明細
              <ArrowNextIcon />
            </button>
          </div>
        </div>
      </ContentWrapper>
    ));
  };

  /**
   * 產生頁面
   * 只要提供相同數量的 slides 和 content，SwiperLayout會自動切換對應的內容。
   */
  return (
    <Layout title="貸款">
      <MainScrollWrapper>
        <PageWrapper>
          <SwiperLayout slides={renderSlides(loans)} hasDivider={false} slidesPerView={1.1} spaceBetween={8} centeredSlides>
            { renderContents(loans) }
          </SwiperLayout>
        </PageWrapper>
      </MainScrollWrapper>
    </Layout>
  );
};

export default Page;
