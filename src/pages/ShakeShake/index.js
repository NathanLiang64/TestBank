import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Pagination } from 'swiper/core';
import QRCode from 'qrcode.react';
import { FileCopyOutlined, Share } from '@material-ui/icons';
import Loading from 'components/Loading';
import { FEIBButton, FEIBIconButton } from 'components/elements';
import { shakeShakeApi } from 'apis';
import theme from 'themes/theme';
import 'swiper/swiper.min.css';
import 'swiper/components/pagination/pagination.min.css';
import { setCards, setCardInfo } from './stores/actions';

/* Swiper modules */
SwiperCore.use([Pagination]);

const ShakeShake = () => {
  const [copyAccount, setCopyAccount] = useState(false);

  const cards = useSelector(({ depositOverview }) => depositOverview.cards);
  const cardInfo = useSelector(({ depositOverview }) => depositOverview.cardInfo);

  const dispatch = useDispatch();
  const { doGetInitData } = shakeShakeApi;

  const selectedCard = (id, allCards) => {
    const filteredCard = allCards.find((card) => card.id === id);
    // 將篩選後的卡片資訊存進 redux
    dispatch(setCardInfo(filteredCard));
  };

  const handleClickCopyAccount = () => {
    setCopyAccount(true);
    // 1.5 秒後將 copyAccount 的值重置
    setTimeout(() => setCopyAccount(false), 1500);
  };

  const handleClickTransferButton = () => {
    // 此處應跳頁至轉帳頁，功能可行性待確認
  };

  const renderCopyIconButton = (value) => (
    <div className="copyIconButton">
      <CopyToClipboard
        text={value}
        onCopy={handleClickCopyAccount}
      >
        <FEIBIconButton
          $fontSize={1.6}
          $iconColor={theme.colors.state.success}
        >
          <FileCopyOutlined />
        </FEIBIconButton>
      </CopyToClipboard>
      <span className={`copiedMessage ${copyAccount && 'showMessage'}`}>已複製</span>
    </div>
  );

  const renderAccountInfo = (info) => {
    const { cardName, cardAccount } = info;
    return (
      <>
        <p className="cardName">{cardName}</p>
        <div className="accountInfo">
          <p className="account">{cardAccount}</p>
          { renderCopyIconButton(cardAccount) }
        </div>
      </>
    );
  };

  const renderSlides = (list) => (
    list.map((slide) => {
      const { id, cardAccount } = slide;
      return (
        <SwiperSlide key={id}>
          <div className="customSpace">
            <div>
              <QRCode
                value={`http://${cardAccount}.con`}
                renderAs="svg"
                size={200}
                fgColor={theme.colors.text.dark}
              />
              <FEIBIconButton
                className="shareIconButton"
                $fontSize={1.8}
                $iconColor={theme.colors.state.success}
              >
                <Share />
              </FEIBIconButton>
            </div>
          </div>
        </SwiperSlide>
      );
    })
  );

  const renderCodeArea = (data) => (
    <div className="codeArea">
      <Swiper
        pagination
        className="mySwiper"
        onSlideChange={(swiper) => selectedCard(swiper.activeIndex + 1, cards)}
      >
        { renderSlides(data) }
      </Swiper>
    </div>
  );

  // 資料尚未從 api 取回時的等待畫面
  const renderLoading = () => (
    <div className="loadingArea">
      <Loading space="both" />
    </div>
  );

  // 取得所有存款卡的初始資料
  useEffect(async () => {
    const response = await doGetInitData('/api/shakeShake');
    if (response.initData) {
      const { debitCards } = response.initData;
      dispatch(setCards(debitCards));
    }
  }, []);

  // 根據用戶選擇的卡片，將該卡片資料儲存至 redux，預設顯示 id 為 1 的卡片
  useEffect(() => {
    selectedCard(1, cards);
  }, [cards]);

  return (
    <>
      <div className="title">
        <h3>QRCode 收款</h3>
      </div>
      { cardInfo && renderAccountInfo(cardInfo) }
      { (cards && cardInfo) ? renderCodeArea(cards) : renderLoading() }
      <div className="buttonArea">
        <FEIBButton onClick={handleClickTransferButton}>登入後轉帳</FEIBButton>
      </div>
    </>
  );
};

export default ShakeShake;
