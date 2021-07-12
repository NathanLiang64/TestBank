import SnackModalWrapper from './snackModal.style';

/*
* =================== SnackModal 組件說明 ====================
* 用於執行某動作後出現在畫面正中央的的提示訊息 (淺主色背景 + 白色文字)
* =================== SnackModal 可傳參數 ====================
* 1. icon -> 顯示的圖標
* 2. text -> 顯示的提示訊息
* */

const SnackModal = ({ icon, text }) => (
  <SnackModalWrapper>
    {icon}
    <p className="displayMessage">
      {text}
    </p>
  </SnackModalWrapper>
);

export default SnackModal;
