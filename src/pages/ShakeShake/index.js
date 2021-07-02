import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Pagination } from 'swiper/core';
import QRCode from 'qrcode.react';
import { ArrowForwardIosRounded, FileCopyOutlined, Share } from '@material-ui/icons';
import ScanPhoto from 'assets/images/scanningQRCode.png';
import Loading from 'components/Loading';
import BottomDrawer from 'components/BottomDrawer';
import {
  // eslint-disable-next-line no-unused-vars
  FEIBIconButton, FEIBTabContext, FEIBTab, FEIBTabList, FEIBTabPanel,
} from 'components/elements';
import { shakeShakeApi } from 'apis';
import theme from 'themes/theme';
import 'swiper/swiper.min.css';
import 'swiper/components/pagination/pagination.min.css';
import { setIsShake, setUserCards, setUserCardInfo } from './stores/actions';
import ShakeShakeWrapper from './shakeShake.style';

/* Swiper modules */
SwiperCore.use([Pagination]);

const ShakeShake = () => {
  const [tabId, setTabId] = useState('0');
  const [copyAccount, setCopyAccount] = useState(false);

  const isShake = useSelector(({ shakeShake }) => shakeShake.isShake);
  const userCards = useSelector(({ shakeShake }) => shakeShake.userCards);
  const userCardInfo = useSelector(({ shakeShake }) => shakeShake.userCardInfo);

  const dispatch = useDispatch();
  const { doGetShakeInitData } = shakeShakeApi;

  const selectedUserCard = (id, allCards) => {
    const filteredCard = allCards.find((card) => card.id === id);
    // 將篩選後的卡片資訊存進 redux
    dispatch(setUserCardInfo(filteredCard));
  };

  const handleClickCopyAccount = () => {
    setCopyAccount(true);
    // 1.5 秒後將 copyAccount 的值重置
    setTimeout(() => setCopyAccount(false), 1500);
  };

  // const handleClickTransferButton = () => {
  //   dispatch(setIsShake(false));
  //   push('/QRCodeTransfer');
  // };

  const handleChangeTabList = (event, id) => {
    setTabId(id);
  };

  const renderCopyIconButton = (value) => (
    <div className="copyIconButton">
      <CopyToClipboard
        text={value}
        onCopy={handleClickCopyAccount}
      >
        <FEIBIconButton
          $fontSize={1.6}
          $iconColor={theme.colors.text.lightGray}
        >
          <FileCopyOutlined />
        </FEIBIconButton>
      </CopyToClipboard>
      <span className={`copiedMessage ${copyAccount && 'showMessage'}`}>已複製</span>
    </div>
  );

  const renderAccountInfo = (info) => {
    const { bankName, cardName, cardAccount } = info;
    return (
      <>
        <p className="cardName">{cardName}</p>
        <div className="accountInfo">
          <p className="account">{`${bankName} ${cardAccount}`}</p>
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
            <QRCode
              value={`http://${cardAccount}.con`}
              renderAs="svg"
              size={172}
              fgColor={theme.colors.text.dark}
            />
            <div className="shareButtonArea">
              <FEIBIconButton
                className="shareIconButton"
                $fontSize={1.8}
                $iconColor={theme.colors.text.dark}
              >
                <Share />
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
        className="mySwiper"
        onSlideChange={(swiper) => selectedUserCard(swiper.activeIndex + 1, userCards)}
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

  useEffect(async () => {
    // 取得所有存款卡的初始資料
    const qrCodeResponse = await doGetShakeInitData('/api/shakeShake');
    if (qrCodeResponse.initData) {
      const { debitCards } = qrCodeResponse.initData;
      dispatch(setUserCards(debitCards));
    }
  }, []);

  // 根據用戶選擇的卡片，將該卡片資料儲存至 redux，預設顯示 id 為 1 的卡片
  useEffect(() => {
    selectedUserCard(1, userCards);
  }, [userCards]);

  // TODO: 判斷是否已登入，若未登入則不可轉帳
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
