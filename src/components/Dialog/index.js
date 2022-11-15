import { DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { FEIBIconButton } from 'components/elements';
import { CrossIcon } from 'assets/images/icons';
import DialogWrapper from './dialog.style';

/*
* ==================== Dialog 組件說明 ====================
* Dialog 組件封裝了 Material UI 的彈窗組件
* ==================== Dialog 可傳參數 ====================
* 1. title -> 顯示於彈窗標題之文字，預設為 "系統訊息"
* 2. content -> 顯示於彈窗內文
* 3. action -> 顯示於彈窗底部，放置觸發事件的按鈕
* 4. isOpen -> 根據此布林值判斷彈窗是否開啟 (true 開啟、false 關閉)
* 5. onClose -> 點擊彈窗背景遮罩時所觸發的事件 (通常點擊遮罩要關閉彈窗，建議傳入觸發彈窗關閉的事件)
* */

const Dialog = ({
  title,
  content,
  action,
  isOpen,
  onClose,
  showCloseButton = true,
}) => (
  <DialogWrapper
    open={isOpen}
    // onClose={onClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">
      {title || '系統訊息'}
    </DialogTitle>
    <DialogContent>
      {content}
    </DialogContent>
    { action && (
      <DialogActions>
        {action}
      </DialogActions>
    ) }
    { onClose && showCloseButton && (
      <FEIBIconButton
        className="closeIconButton"
        onClick={onClose}
      >
        <CrossIcon />
      </FEIBIconButton>
    ) }
  </DialogWrapper>
);

export default Dialog;
