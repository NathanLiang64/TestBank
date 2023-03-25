import { useState, useRef } from 'react';
import { useHistory } from 'react-router';
import uuid from 'react-uuid';
import { loadFuncParams, useNavigation } from 'hooks/useNavigation';

import { ArrowNextIcon } from 'assets/images/icons';
import Loading from 'components/Loading';
import EmptyData from 'components/EmptyData';
import LoanCard from 'components/CreditCard';
import Layout from 'components/Layout/Layout';
import SwiperLayout from 'components/SwiperLayout';
import { MainScrollWrapper } from 'components/Layout';
import InformationTape from 'components/InformationTape';
import ThreeColumnInfoPanel from 'components/ThreeColumnInfoPanel';
import {
  accountFormatter, dateToString, currencySymbolGenerator, handleLoanTypeToTitle,
} from 'utilities/Generator';
import { Func } from 'utilities/FuncID';
import { getBranchCode } from 'utilities/CacheData';
import CopyTextIconButton from 'components/CopyTextIconButton';
import { getSubSummary } from './api';
import { handleSubPaymentHistory } from './utils';
import { ContentWrapper } from './L00100.style';
import EmptySlide from './components/EmptySlide';
import EmptyContent from './components/EmptyContent';

/**
 * L00100 貸款 首頁
 */
const Page = (props) => {
  const {location: {state}} = props;
  const detailsRef = useRef();
  const history = useHistory();
  const {startFunc} = useNavigation();
  const [viewModel, setViewModel] = useState({
    detailMap: {}, loans: null, defaultSlide: 0, branchCodeList: [],
  });

  // 滑動卡片時，拿取當下貸款的交易紀錄
  const onSlideChange = async (swiper) => {
    if (viewModel.detailMap[swiper.activeIndex]) {
      setViewModel((vm) => ({...vm, defaultSlide: swiper.activeIndex}));
      return;
    }
    const currentLoan = viewModel.loans[swiper.activeIndex];

    if (currentLoan) {
      const detail = await handleSubPaymentHistory(currentLoan.account, currentLoan.subNo);
      setViewModel((vm) => {
        const newDetailMap = {...vm.detailMap, [swiper.activeIndex]: detail};
        return {...vm, detailMap: newDetailMap, defaultSlide: swiper.activeIndex};
      });
    }
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
  const handleSearchClick = (account, subNo) => startFunc(Func.L002.id, { account, subNo }, viewModel);

  // 信用卡卡面的功能列表
  const functionAllList = () => {
    const list = [{ fid: 'L001002', title: '貸款資訊'}];

    return (
      <ul className="functionList">
        { list.map(({fid, title}) => (
          <li key={fid}>
            <button type="button" onClick={() => history.push(fid, {viewModel})}>
              {title}
            </button>
          </li>
        ))}
      </ul>
    );
  };

  /**
   * 產生上方卡片的 slides
   */
  const renderSlides = (cards) => {
    if (!cards || cards?.length === 0) return [];

    const cardsWithEmptySlide = [...cards, undefined];
    return cardsWithEmptySlide.map((card) => {
      if (!card) return <div style={{paddingTop: '5.2rem'}}><EmptySlide key={uuid()} /></div>;
      const branchId = card.debitAccount.substring(0, 3);
      const branchName = viewModel.branchCodeList.find((b) => b.branchNo === branchId)?.branchName ?? branchId;
      const accountNo = accountFormatter(card.account, true);

      return (
        <div style={{paddingTop: '5.2rem'}}>
          <LoanCard
            cardName={`${card.loanType ?? '信用貸款'} ${card.subNo}`}
            accountNo={(
              <>
                {`${branchName} ${accountNo}`}
                <CopyTextIconButton copyText={card.account} />
              </>
            )}
            color="lightPurple"
            annotation="貸款餘額"
            balance={card.balance}
            functionList={functionAllList()}
          />
        </div>
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
      value: currencySymbolGenerator(loan.currency ?? 'NTD', loan.payAmount, true),
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
    const sortedTransactions = detail.sort((a, b) => parseInt(b.date, 10) - parseInt(a.date, 10));

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
        key={uuid()}
        type="button"
        aria-label={`點擊查詢此筆紀錄，還款日:${dateToString(t.date)}，金額：${currencySymbolGenerator(t.currency ?? 'NTD', t.amount, true)}`}
        onClick={() => handleSingleTransaction(i, detail, loan)}
        style={{ width: '100%' }}
      >
        <InformationTape
          topLeft={handleLoanTypeToTitle(t.type)}
          bottomLeft={dateToString(t.date)}
          topRight={currencySymbolGenerator(t.currency ?? 'NTD', t.amount, true)}
          bottomRight={`貸款餘額 ${currencySymbolGenerator(t.currency ?? 'NTD', t.balance, true)}`}
        />
      </button>
    ));
  };

  const handleMoreTransactionsClick = (loan) => startFunc(Func.L003.id, { loan });

  /**
   * 產生下方交易資訊的 slides
   */
  const renderContents = () => {
    if (!viewModel.loans || viewModel.loans?.length === 0) return [];
    const loansWithEmptyContent = [...viewModel.loans, undefined];
    return loansWithEmptyContent.map((loan, i) => {
      if (!loan) return <EmptyContent key={uuid()} onAddClick={() => { console.log('TODO'); }} />; // TODO  待提供申請連結

      return (
        <ContentWrapper key={uuid()}>
          <div className="panel">
            <ThreeColumnInfoPanel content={renderBonusContents(loan)} />
          </div>
          <div ref={detailsRef}>
            <div>{renderTransactions(viewModel.detailMap[i], loan)}</div>
            <div className="toolbar">
              {viewModel.detailMap[i] && viewModel.detailMap[i].length > 0 && (
              <button className="btn-icon" type="button" onClick={() => handleMoreTransactionsClick(loan)}>
                更多明細
                <ArrowNextIcon />
              </button>
              )}
            </div>
          </div>
        </ContentWrapper>
      );
    });
  };

  const fetchSummaryAndHistory = async () => {
    const loans = await getSubSummary();
    const branchCodeList = await getBranchCode();
    let detail = {};
    if (loans.length) detail = await handleSubPaymentHistory(loans[0].account, loans[0].subNo);
    return {
      ...viewModel, loans, detailMap: {0: detail}, branchCodeList,
    };
  };

  /**
   * 檢查是否可以開啟這個頁面。
   * @returns {Promise<String>} 傳回驗證結果的錯誤訊息；若是正確無誤時，需傳回 null
   */
  const inspector = async () => {
    let error = null;
    // 分帳應繳摘要資訊
    const params = await loadFuncParams();
    const vModel = state?.viewModel || params || await fetchSummaryAndHistory();
    if (vModel.loans.length !== 0) setViewModel((vm) => ({...vm, ...vModel}));
    else error = '您尚未擁有貸款，請在系統關閉此功能後，立即申請。';
    return error;
  };

  return (
    <Layout fid={Func.L001} title="貸款" inspector={inspector}>
      <MainScrollWrapper>
        <SwiperLayout
          slides={renderSlides(viewModel.loans)}
          hasDivider={false}
          slidesPerView={1.06}
          spaceBetween={8}
          centeredSlides
          onSlideChange={onSlideChange}
          initialSlide={viewModel.defaultSlide}
        >
          {renderContents()}
        </SwiperLayout>
      </MainScrollWrapper>
    </Layout>
  );
};

export default Page;
