import AlertWrapper from './alert.style';

/*
* ==================== Alert 組件說明 ====================
* Alert 組件封裝了 Material UI 的 Alert 組件
* ==================== Alert 可傳參數 ====================
* 1. state -> 共可接收 "error", "warning", "info", "success" 字串
*    此組件將根據上述 4 種不同狀態而產生不同的樣式色彩，預設為 "error"
* 2. children -> 顯示文字，不須設置 children 屬性，直接在標籤內部填寫文字
* */

const Alert = ({ state, children }) => (
  <AlertWrapper severity={state || 'error'}>
    {children}
  </AlertWrapper>
);

export default Alert;
