/* eslint react/no-array-index-key: 0 */
import { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import uuid from 'react-uuid';

import { setWaittingVisible } from 'stores/reducers/ModalReducer';

import { ArrowNextIcon } from 'assets/images/icons';
import { MainScrollWrapper } from 'components/Layout';
import Layout from 'components/Layout/Layout';
import SwiperLayout from 'components/SwiperLayout';
import AccountCard from 'components/AccountCard';
import ThreeColumnInfoPanel from 'components/ThreeColumnInfoPanel';
import InformationTape from 'components/InformationTape';
import EmptyData from 'components/EmptyData';
import Loading from 'components/Loading';
import {
  accountFormatter, dateToString, currencySymbolGenerator, handleLoanTypeToTitle,
} from 'utilities/Generator';

import { Func } from 'utilities/FuncID';
import { useNavigation } from 'hooks/useNavigation';
import { getBranchCode } from 'utilities/CacheData';
import { getSubSummary } from './api';
import { handleSubPaymentHistory } from './utils';
import PageWrapper, { ContentWrapper } from './L00100.style';

const uid = uuid();

/**
 * L00100 貸款 首頁
 */
const Page = () => {
  const branchCodeList = useRef([]);// 拿分行代碼
  const detailsRef = useRef();
  const history = useHistory();
  const dispatch = useDispatch();
  const {startFunc} = useNavigation();

  const [loans, setLoans] = useState();
  const [detailMap, setDetailMap] = useState({});

  useEffect(async () => {
    branchCodeList.current = await getBranchCode();
  }, []);

  // 依照currentIndex取得當筆貸款的交易紀錄
  const fetchDetailMap = async (account, subNo, debitAccount, currentIndex) => {
    const currentLoanDetail = await handleSubPaymentHistory(account, subNo);

    setDetailMap((prevMap) => ({
      ...prevMap,
      [currentIndex]: currentLoanDetail,
    }));
  };

  // 滑動卡片時，拿取當下貸款的交易紀錄
  const onSlideChange = async (swiper) => {
    if (detailMap[swiper.activeIndex]) return;
    const currentLoan = loans[swiper.activeIndex];

    fetchDetailMap(currentLoan.account, currentLoan.subNo, currentLoan.debitAccount, swiper.activeIndex);
  };

  /**
   * 產生上方卡片會用到的
   */
  // const handleMoreClick = (account, subNo) => {
  //   const list = [
  //     { icon: <CircleIcon />, title: '貸款資訊', onClick: () => { history.push('/L001002', { account, subNo }); } },
  //     /*
  //     { icon: <CircleIcon />, title: '部分貸款', onClick: () => {} },
  //     { icon: <CircleIcon />, title: '全部貸款', onClick: () => {} },
  //     { icon: <CircleIcon />, title: '合約下載', onClick: () => { getContract({ account, format: 1 }); } },
  //     { icon: <CircleIcon />, title: '清償證明下載', onClick: () => { getStatment({ accountNo, format: 1 }); } },
  //     */
  //   ];
  //   dispatch(setDrawer({
  //     title: '',
  //     content: (
  //       <ul>
  //         {list.map((func) => (
  //           <li key={func.title}>
  //             <button type="button" onClick={func.onClick}>
  //               {func.icon}
  //               {func.title}
  //             </button>
  //           </li>
  //         ))}
  //       </ul>
  //     ),
  //     shouldAutoClose: true,
  //   }));
  //   dispatch(setDrawerVisible(true));
  // };

  // 前往查詢應繳本息頁面
  const handleSearchClick = (account, subNo) => startFunc(Func.L002.id, { account, subNo });

  /**
   * 產生上方卡片的 slides
   */
  const renderSlides = (cards) => {
    if (!cards || cards?.length === 0) return [];

    return cards.map((card, i) => {
      const branchId = card.debitAccount.substring(0, 3);

      return (
        <AccountCard type="L" key={`${uid}-c${i}`}>
          <div className="justify-between items-start">
            <div>
              {/* 目前還沒有 loanType 資料，暫時以信用貸款顯示 */}
              <div>
                {card.loanType ?? '信用貸款'}
                &nbsp;
                {`(${card.subNo})`}
              </div>
              <div>
                {branchCodeList.current.find((b) => b.branchNo === branchId)?.branchName ?? branchId}
                &nbsp;
                {`${accountFormatter(card.account)}`}
              </div>
            </div>
            {/* <FEIBIconButton className="-mt-5 -mr-5" aria-label="展開下拉式選單" onClick={() => handleMoreClick(card.account, card.subNo)}>
              <MoreIcon />
            </FEIBIconButton> */}
          </div>
          <div className="justify-end items-baseline gap-4">
            <div className="balance">{currencySymbolGenerator(card.currency ?? 'NTD', card.balance)}</div>
          </div>
          <div className="justify-end gap-6 mt-4 divider">
            <button type="button" className="text-16" onClick={() => history.push('/L001002', { account: card.account, subNo: card.subNo })}>貸款資訊</button>
          </div>
        </AccountCard>
      );
    });
  };

  /**
   * 產生下方資訊會用到的
   */
  const renderBonusContents = (loan) => ([
    {
      label: '應繳款日',
      value: `每月${loan.dayToPay}日`,
    },
    {
      label: '應繳本息',
      value: currencySymbolGenerator(loan.currency ?? 'NTD', loan.payAmount),
      onClick: () => handleSearchClick(loan.account, loan.subNo),
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

  const handleSingleTransaction = async (i, detail, loan) => {
    if (detail) {
      startFunc('L003001', { singleHistoryData: detail[i], cardData: loan });
    }
  };

  const renderTransactions = (detail, loan) => {
    if (!detail) return <Loading space="both" isCentered />;
    if (!detail.length) return <EmptyData height="30vh" />;

    // transactions 依照日期排序（大 -> 小）
    const sortedTransactions = detail.sort((a, b) => parseInt(b.txnDate, 10) - parseInt(a.txnDate, 10));

    // TODO: 計算顯示明細數量方法寫成公用方法

    // 計算可顯示的明細項目數量。
    const yPos = detailsRef?.current?.getBoundingClientRect()?.y;
    const detailAreaHeight = yPos ? window.innerHeight - yPos : 430; // 如果沒有，預設顯示 5 筆

    // 根據剩餘高度計算要顯示的卡片數量，計算裝置可容納的交易明細卡片數量
    const list = [];
    const computedCount = Math.floor((detailAreaHeight - 30) / 80);
    for (let i = 0; (i < computedCount && i < sortedTransactions.length); i++) {
      list.push(sortedTransactions[i]);
    }

    return list.map((t, i) => (
      <button
        key={`${uid}-t${i}`}
        type="button"
        aria-label={`點擊查詢此筆紀錄，還款日:${dateToString(t.txnDate)}，金額：${currencySymbolGenerator(t.currency ?? 'NTD', t.amount)}`}
        onClick={() => handleSingleTransaction(i, detail, loan)}
        style={{ width: '100%' }}
      >
        <InformationTape
          topLeft={handleLoanTypeToTitle(t.type)}
          bottomLeft={dateToString(t.txnDate)}
          topRight={currencySymbolGenerator(t.currency ?? 'NTD', t.amount)}
          bottomRight={`貸款餘額 ${currencySymbolGenerator(t.currency ?? 'NTD', t.balance)}`}
        />
      </button>
    ));
  };

  const handleMoreTransactionsClick = (loan) => startFunc(Func.L003.id, { loan });

  /**
   * 產生下方交易資訊的 slides
   */
  const renderContents = () => {
    if (!loans || loans?.length === 0) return [];

    return loans.map((loan, i) => (
      <ContentWrapper key={`${uid}-a${i}`}>
        <div className="panel">
          <ThreeColumnInfoPanel content={renderBonusContents(loan)} />
        </div>
        <div ref={detailsRef}>
          <div>{renderTransactions(detailMap[i], loan)}</div>
          <div className="toolbar">
            {detailMap[i] && detailMap[i].length > 0 && (
            <button className="btn-icon" type="button" onClick={() => handleMoreTransactionsClick(loan)}>
              更多明細
              <ArrowNextIcon />
            </button>
            )}
          </div>
        </div>
      </ContentWrapper>
    ));
  };

  /**
   * 檢查是否可以開啟這個頁面。
   * @returns {Promise<String>} 傳回驗證結果的錯誤訊息；若是正確無誤時，需傳回 null
   */
  const inspector = async () => {
    dispatch(setWaittingVisible(true));
    let error;

    // 分帳應繳摘要資訊
    const subSummaryRes = await getSubSummary();

    if (subSummaryRes.length !== 0) {
      error = null;
      setLoans(subSummaryRes);
      fetchDetailMap(subSummaryRes[0].account, subSummaryRes[0].subNo, subSummaryRes[0].debitAccount, 0);
    } else {
      error = '您尚未擁有貸款，請在系統關閉此功能後，立即申請。';
    }

    dispatch(setWaittingVisible(false));
    return error;
  };

  return (
    <Layout fid={Func.L001} title="貸款" inspector={inspector}>
      <MainScrollWrapper>
        <PageWrapper>
          <SwiperLayout
            slides={renderSlides(loans)}
            hasDivider={false}
            slidesPerView={1.06}
            spaceBetween={8}
            centeredSlides
            onSlideChange={onSlideChange}
          >
            {renderContents()}
          </SwiperLayout>
        </PageWrapper>
      </MainScrollWrapper>
    </Layout>
  );
};

export default Page;
