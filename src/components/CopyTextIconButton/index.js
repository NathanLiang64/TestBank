import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import SnackModal from 'components/SnackModal';
import { FEIBIconButton } from 'components/elements';
import { CopyIcon } from 'assets/images/icons';
import theme from 'themes/theme';
import CopyTextIconButtonWrapper from './copyTextIconButton.style';

/*
* ================= CopyTextIconButton 組件說明 ==================
* 此組件封裝了 CopyToClipboard、FEIBIconButton 和 ShackModal
* ================= CopyTextIconButton 可傳參數 ==================
* 1. copyText -> 需要被複製的文字
* 2. displayMessage -> 複製後顯示的訊息，若不傳值則預設顯示 "已複製帳號"
* 3. iconColor -> IconButton 的圖標顏色
* */

const CopyTextIconButton = ({
  copyText, displayMessage, iconColor,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleClickCopyAccount = () => {
    setIsCopied(true);
    // 1 秒後將 isCopied 的值重置
    setTimeout(() => setIsCopied(false), 1000);
  };

  return (
    <CopyTextIconButtonWrapper>
      <CopyToClipboard
        text={copyText}
        onCopy={handleClickCopyAccount}
      >
        <FEIBIconButton
          $iconColor={iconColor || theme.colors.text.lightGray}
          $fontSize={1.6}
        >
          <CopyIcon size={16} />
        </FEIBIconButton>
      </CopyToClipboard>
      {
        isCopied && (
          <SnackModal
            icon={<CopyIcon size={32} color={theme.colors.basic.white} />}
            text={displayMessage || '已複製帳號'}
          />
        )
      }
    </CopyTextIconButtonWrapper>
  );
};

export default CopyTextIconButton;
