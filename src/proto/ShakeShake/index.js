import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Pagination } from 'swiper/core';
import QRCode from 'qrcode.react';
import { ArrowForwardIosRounded } from '@material-ui/icons';
import ScanPhoto from 'assets/images/scanningQRCode.png';
import BottomDrawer from 'components/BottomDrawer';
import CopyTextIconButton from 'components/CopyTextIconButton';
import Loading from 'components/Loading';
import {
  FEIBIconButton, FEIBTabContext, FEIBTab, FEIBTabList, FEIBTabPanel,
} from 'components/elements';
import { accountFormatter } from 'utilities/Generator';
import { ShareIcon } from 'assets/images/icons';
import theme from 'themes/theme';
import { setIsShake, setUserCards, setUserCardInfo } from './stores/actions';
import ShakeShakeWrapper from './shakeShake.style';
import { getDebitCard } from './mockData';

/* Swiper modules */
SwiperCore.use([Pagination]);

const ShakeShake = () => {
  const [tabId, setTabId] = useState('0');
  const isShake = useSelector(({ shakeShake }) => shakeShake.isShake);
  const userCards = useSelector(({ shakeShake }) => shakeShake.userCards);
  const userCardInfo = useSelector(({ shakeShake }) => shakeShake.userCardInfo);

  const dispatch = useDispatch();

  const selectedUserCard = (id, allCards) => {
    const filteredCard = allCards.find((card) => card.id === id);
    // 將篩選後的卡片資訊存進 redux
    dispatch(setUserCardInfo(filteredCard));
  };

  // const handleClickTransferButton = () => {
  //   dispatch(setIsShake(false));
  //   push('/QRCodeTransfer');
  // };

  const handleChangeTabList = (event, id) => {
    setTabId(id);
  };

  const renderAccountInfo = (info) => {
    const { bankName, cardName, cardAccount } = info;
    return (
      <>
        <p className="cardName">{cardName}</p>
        <div className="accountInfo">
          <p className="account">{`${bankName} ${accountFormatter(cardAccount)}`}</p>
          <CopyTextIconButton copyText={cardAccount} />
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
            <QRCode
              value={`http://${cardAccount}.con`}
              renderAs="svg"
              size={172}
              fgColor={theme.colors.text.dark}
            />
            <div className="shareButtonArea">
              <FEIBIconButton className="shareIconButton">
                <ShareIcon size={16} color={theme.colors.text.dark} />
              </FEIBIconButton>
              <p>分享QR CODE</p>
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
        onSlideChange={(swiper) => selectedUserCard(swiper.activeIndex + 1, userCards)}
      >
        { renderSlides(data) }
      </Swiper>
    </div>
  );

  // 資料尚未從 api 取回時的等待畫面
  const renderLoading = () => (
    <div className="loadingArea">
      <Loading space="both" color={theme.colors.text.light} />
    </div>
  );

  useEffect(async () => {
    // 取得所有存款卡的初始資料
    // const qrCodeResponse = await doGetShakeInitData('/api/shakeShake');
    // if (qrCodeResponse.initData) {
    //   const { debitCards } = qrCodeResponse.initData;
    //   dispatch(setUserCards(debitCards));
    // }
    dispatch(setUserCards(getDebitCard.debitCards));
  }, []);

  // 根據用戶選擇的卡片，將該卡片資料儲存至 redux，預設顯示 id 為 1 的卡片
  useEffect(() => {
    selectedUserCard(1, userCards);
  }, [userCards]);

  // 判斷是否已登入，若未登入則不可轉帳
  return (
    <BottomDrawer
      title="QRCode 轉帳"
      isOpen={isShake}
      onClose={() => dispatch(setIsShake(false))}
      content={(
        <ShakeShakeWrapper>
          <FEIBTabContext value={tabId}>
            <FEIBTabList $size="small" $type="fixed" onChange={handleChangeTabList}>
              <FEIBTab label="要錢" value="0" />
              <FEIBTab label="給錢" value="1" />
            </FEIBTabList>
            <FEIBTabPanel value="0">
              { userCardInfo && renderAccountInfo(userCardInfo) }
              { (userCards && userCardInfo) ? renderCodeArea(userCards) : renderLoading() }
            </FEIBTabPanel>
            <FEIBTabPanel value="1">
              <p>掃描收款人的 QR code，進行轉帳。</p>
              <div className="scanArea">
                <img src={ScanPhoto} style={{ width: 'auto', height: '100%' }} alt="" />
                <div className="maskArea">
                  <div className="mask" />
                  <div className="mask" />
                  <div className="mask" />
                  <div className="mask" />
                  <div className="mask empty">
                    <ArrowForwardIosRounded className="topLeft" />
                    <ArrowForwardIosRounded className="topRight" />
                    <ArrowForwardIosRounded className="bottomLeft" />
                    <ArrowForwardIosRounded className="bottomRight" />
                  </div>
                  <div className="mask" />
                  <div className="mask" />
                  <div className="mask" />
                  <div className="mask" />
                </div>
              </div>
            </FEIBTabPanel>
          </FEIBTabContext>
        </ShakeShakeWrapper>
      )}
    />
  );
};

export default ShakeShake;
