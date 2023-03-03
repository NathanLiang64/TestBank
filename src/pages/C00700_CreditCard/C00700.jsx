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
import { showCustomDrawer, showCustomPrompt, showError } from 'utilities/MessageModal';
import { R005, CreditCardIcon6, CircleIcon } from 'assets/images/icons';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';

import { useNavigation, loadFuncParams } from 'hooks/useNavigation';
import { getCards, getTransactions, updateTxnNotes } from './api';
import {
  backInfo, levelInfo, renderBody, renderHead,
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
const CreditCardPage = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const {location: {state}} = props;
  const {startFunc, closeFunc} = useNavigation();
  const [viewModel, setViewModel] = useState({
    cardsInfo: [], usedCardLimit: '', defaultSlide: 0, bankeeCardNo: '',
  });

  const go2Func = (funcId, params) => startFunc(funcId, params, viewModel);

  const fetchTransactions = async (cardNo, currentIndex) => {
    if (viewModel.cardsInfo[currentIndex]?.txnDetails) return;
    const txns = await getTransactions(cardNo);
    setViewModel((vm) => {
      vm.cardsInfo[currentIndex].txnDetails = txns;
      return {...vm};
    });
  };

  // 滑動卡片時，拿取當下信用卡的交易明細
  const onSlideChange = async (swiper) => {
    const {cardNo} = viewModel.cardsInfo[swiper.activeIndex];
    viewModel.defaultSlide = swiper.activeIndex;
    fetchTransactions(cardNo ?? '', swiper.activeIndex); // cardNo 無值，則傳空字串代表拿取所有信用卡的明細
  };

  // 編輯信用卡明細備註的 Handler
  const onTxnNotesEdit = async (payload, isBankeeCard) => {
    const { isSuccess, message } = await updateTxnNotes(payload);
    if (isSuccess) { // updateTxNotes API 打成功才更新畫面
      const {txKey, note, cardNo} = payload;
      const [key, otherKey] = isBankeeCard ? [0, 1] : [1, 0];
      viewModel.cardsInfo[key].txnDetails.find((txn) => txn.txKey === txKey).note = note; // 直接 mutate
      // 若改變的是 bankee 信用卡的明細，且另一個卡面已拿過資料，也需連動改變
      const isBankeeTxn = viewModel.bankeeCardNo === cardNo;
      if (viewModel.cardsInfo[otherKey]?.txnDetails && isBankeeTxn) {
        viewModel.cardsInfo[otherKey].txnDetails.find((txn) => txn.txKey === txKey).note = note; // 直接 mutate
      }
      setViewModel((vm) => ({...vm}));
    } else showError(message);
  };

  // 信用卡卡面的功能列表
  const functionAllList = (item) => {
    const list = [
      { fid: Func.R002.id, title: '晚點付'},
      { fid: Func.R003.id, title: '帳單'},
      { fid: Func.R004.id, title: '繳費', bankeeCardNo: viewModel.bankeeCardNo},
    ];
    if (!item.isBankeeCard) list.splice(0, 1);

    return (
      <ul className="functionList">
        { list.map(({fid, title, bankeeCardNo}) => (
          <li key={fid}>
            <button type="button" onClick={() => go2Func(fid, {bankeeCardNo})}>
              {title}
            </button>
          </li>
        ))}
      </ul>
    );
  };

  // 信用卡更多
  const handleMoreClick = (isBankeeCard) => {
    const list = [
      {
        fid: '/C007001', icon: <CreditCardIcon6 />, title: '信用卡資訊', param: {viewModel, isBankeeCard},
      },
      { fid: `${Func.R005.id}`, icon: <R005 />, title: '自動扣繳' },
      {
        fid: '/C007002', icon: <CircleIcon />, title: '每月現金回饋', param: { viewModel },
      },
    ];
    const options = (
      <ul>
        {list.map((item) => (
          <li key={item.fid}>
            <button
              type="button"
              onClick={() => {
                if (item.fid.includes(Func.R005.id)) go2Func(item.fid, null);
                else history.push(item.fid, item.param);
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
    if (!viewModel.cardsInfo.length) return null;
    return (
      viewModel.cardsInfo.map((cardSet) => (
        <SwiperCreditCard>
          <CreditCard
            key={cardSet.isBankeeCard ? '0' : '1'}
            cardName={cardSet.isBankeeCard ? 'Bankee信用卡' : '所有信用卡'}
            accountNo={cardSet.isBankeeCard && cardSet.cardNo}
            balance={viewModel.usedCardLimit}
            color="green"
            annotation="已使用額度"
            onMoreClicked={() => handleMoreClick(cardSet.isBankeeCard)}
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
              <tr>{renderHead(info.title)}</tr>
            </thead>
            <tbody>{renderBody(info.body)}</tbody>
          </table>
          <div className="remark">
            <div>＊</div>
            <div>依個人Bankee數存月平均存款餘額核定等級</div>
          </div>
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
      onClick: () => history.push('/C007002', { viewModel }),
    },
  ];

  // 信用卡明細總覽
  const renderCreditList = () => {
    if (!viewModel.cardsInfo.length) return null;
    return (
      viewModel.cardsInfo.map((cardInfo, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index}>
          <DetailDialogContentWrapper>
            {cardInfo.isBankeeCard && (
              <div className="panel">
                <ThreeColumnInfoPanel content={bonusInfo(cardInfo)} />
              </div>
            )}
          </DetailDialogContentWrapper>
          <CreditCardTxsListWrapper>
            <CreditCardTxsList
              cardInfo={cardInfo}
              onMoreFuncClick={() => go2Func(Func.R001.id, {
                cardInfo: {...cardInfo, usedCardLimit: viewModel.usedCardLimit},
                transactions: viewModel.cardsInfo[index].txnDetails,
              })}
              transactions={viewModel.cardsInfo[index].txnDetails}
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
    let model = {};
    const params = await loadFuncParams();

    if (state || params) model = state || params; // 從C00700X 傳回  || R00100-R00500 傳回
    else { // 若是第一次進來此畫面
      const {cards, usedCardLimit} = await getCards();
      const bankeeCard = cards.find(({isBankeeCard}) => !!isBankeeCard);
      model = { cardsInfo: [bankeeCard], usedCardLimit, bankeeCardNo: bankeeCard.cardNo };
      if (cards.length >= 2) model.cardsInfo.push({isBankeeCard: false}); // 有第二張以上的卡片都是「非 bankee」信用卡
      fetchTransactions(bankeeCard.cardNo, 0);
    }

    setViewModel((vm) => ({ ...vm, ...model }));
    dispatch(setWaittingVisible(false));
  }, []);

  return (
    <Layout fid={Func.C007} title="信用卡" goBackFunc={closeFunc}>
      <MainScrollWrapper>
        <SwiperLayout
          slides={renderSlides()}
          hasDivider={false}
          slidesPerView={1.06}
          spaceBetween={8}
          centeredSlides
          onSlideChange={onSlideChange}
          initialSlide={viewModel.defaultSlide}
        >
          {renderCreditList()}
        </SwiperLayout>
      </MainScrollWrapper>
    </Layout>
  );
};

export default CreditCardPage;
