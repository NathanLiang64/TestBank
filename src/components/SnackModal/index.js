import { DialogContent, DialogTitle } from '@material-ui/core';
import SnackModalWrapper, { SnackModalDialogWrapper } from './snackModal.style';

/*
* =================== SnackModal 組件說明 ====================
* 用於執行某動作後出現在畫面正中央的的提示訊息 (淺主色背景 + 白色文字)
* =================== SnackModal 可傳參數 ====================
* 1. icon -> 顯示的圖標
* 2. text -> 顯示的提示訊息
* */

const SnackModal = ({ icon, text }) => (
  <SnackModalDialogWrapper open>
    <DialogTitle>test</DialogTitle>
    <DialogContent>
      <SnackModalWrapper>
        {icon}
        <p className="displayMessage">
          {text}
        </p>
      </SnackModalWrapper>
    </DialogContent>
  </SnackModalDialogWrapper>
);

export default SnackModal;
