import {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
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
}) => (
  <DialogWrapper
    open={isOpen}
    onClose={onClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title" className="title">
      {title || '系統訊息'}
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        {content}
      </DialogContentText>
    </DialogContent>
    <DialogActions className="alignCenter">
      {action}
    </DialogActions>
  </DialogWrapper>
);

// <Dialog
//   open={open}
//   onClose={handleClose}
//   aria-labelledby="alert-dialog-title"
//   aria-describedby="alert-dialog-description"
// >
//   <DialogTitle id="alert-dialog-title">系統訊息</DialogTitle>
//   <DialogContent>
//     <DialogContentText id="alert-dialog-description">
//       是否確定掛失申請
//     </DialogContentText>
//   </DialogContent>
//   <DialogActions>
//     <ConfirmButtons
//       mainButtonValue="掛失"
//       mainButtonOnClick={handleClose}
//       subButtonValue="取消"
//       subButtonOnClick={handleClose}
//     />
//   </DialogActions>
// </Dialog>

export default Dialog;