import { useState } from 'react';
import QRCode from 'qrcode.react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FileCopyOutlined, ArrowForwardIosRounded } from '@material-ui/icons';
import { useCheckLocation, usePageInfo } from 'hooks';
import InfoArea from 'components/InfoArea';
import {
  FEIBTab,
  FEIBTabContext,
  FEIBTabList,
  FEIBTabPanel,
  FEIBButton, FEIBIconButton,
} from 'components/elements';
import theme from 'themes/theme';
import QRCodeTransferWrapper from './QRCodeTransfer.style';

const QRCodeTransfer = () => {
  const [tabId, setTabId] = useState('0');
  const [copyAccount, setCopyAccount] = useState(false);

  const handleChangeTabList = (event, id) => {
    setTabId(id);
  };

  const handleClickCopyAccount = () => {
    setCopyAccount(true);
    // 1.5 秒後將 copyAccount 的值重置
    setTimeout(() => setCopyAccount(false), 1500);
  };

  const handleClickSelectPicture = () => {
    // eslint-disable-next-line no-alert
    window.alert('開啟手機相簿');
  };

  // 渲染卡片帳號右側的 "複製" 圖標
  const renderCopyIconButton = () => (
    <div className="copyIconButtonArea">
      <CopyToClipboard
        text="034-004-99001234"
        onCopy={handleClickCopyAccount}
      >
        <FEIBIconButton $fontSize={1.6}>
          <FileCopyOutlined />
        </FEIBIconButton>
      </CopyToClipboard>
      <span className={`copiedMessage ${copyAccount && 'showMessage'}`}>已複製</span>
    </div>
  );

  useCheckLocation();
  usePageInfo('/api/QRCodeTransfer');

  return (
    <QRCodeTransferWrapper>
      <FEIBTabContext value={tabId}>
        <FEIBTabList $size="small" $type="fixed" onChange={handleChangeTabList}>
          <FEIBTab label="要錢" value="0" />
          <FEIBTab label="給錢" value="1" />
        </FEIBTabList>

        <FEIBTabPanel value="0">
          <div className="measuredHeight">
            <div className="contentWrapper">
              <div className="codeArea">
                <QRCode
                  value="https://testURL"
                  renderAs="svg"
                  size={248}
                  fgColor={theme.colors.text.dark}
                />
              </div>

              <div className="accountArea">
                <p>收款帳號</p>
                <h3>
                  043-004-*****34
                  { renderCopyIconButton() }
                </h3>
              </div>

              <FEIBButton
                $bgColor={theme.colors.background.cancel}
                $color={theme.colors.text.dark}
              >
                分享 QRCode
              </FEIBButton>
            </div>
          </div>
        </FEIBTabPanel>

        <FEIBTabPanel value="1">
          <div className="measuredHeight customSize">
            {/* 拍照模擬 */}
            <img src="https://cdn.dribbble.com/users/31818/screenshots/3817003/gif-dribb.gif" style={{ width: 'auto', height: '100%' }} alt="" />
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
            <div className="albumArea" onClick={handleClickSelectPicture}>
              <div className="lastPhoto">
                <img src="https://images.unsplash.com/photo-1622069313264-ae43213afe69?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80" alt="" />
              </div>
            </div>
          </div>
          <InfoArea space="top">
            <p>
              請對方至
              <span className="textColorPrimary">QRCode轉帳➝收款</span>
              打開條碼
            </p>
            <p>再由此處掃描QRCode就能轉帳囉</p>
          </InfoArea>
        </FEIBTabPanel>
      </FEIBTabContext>
      {/* <p>1. 掃描或分享 QRCode 就能轉帳囉</p> */}
    </QRCodeTransferWrapper>
  );
};

export default QRCodeTransfer;
