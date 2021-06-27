import InfoAreaWrapper from './infoArea.style';

/*
* ==================== InfoArea 組件說明 ====================
* 說明文字
* ==================== InfoArea 可傳參數 ====================
* 1. className -> 若需在某些頁面更動樣式，可加上 className 參數傳入 class 名稱
* 2. space -> 此組件預設無 margin，可傳入 "top"、"bottom"、"both" 字串來產生固定高度的 margin
* 3. children -> 顯示文字，不須設置 children 屬性，直接在標籤內部填寫文字
* */

const InfoArea = ({ className, space, children }) => (
  <InfoAreaWrapper
    className={className ? `infoArea ${className}` : 'infoArea'}
    $space={space}
  >
    { children }
    <div className="polygon" />
  </InfoAreaWrapper>
);

export default InfoArea;
