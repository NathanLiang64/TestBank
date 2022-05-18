import InfoAreaWrapper from './infoArea.style';

/*
* ==================== InfoArea 組件說明 ====================
* 說明文字
* ==================== InfoArea 可傳參數 ====================
* 1. className -> 若需在某些頁面更動樣式，可加上 className 參數傳入 class 名稱
* 2. space -> 此組件預設無 margin，可傳入 "top"、"bottom"、"both" 字串來產生固定高度的 margin
* 3. children -> 顯示文字，不須設置 children 屬性，直接在標籤內部填寫文字
* 4. position: ('top' | 'bottom') -> 改變尖嘴的位子。
* 5. variants: ('top' | 'bottom') -> 改變樣式。
* 6. color -> 改變文字顏色。
* 7. bgColor -> 改變背景顏色。
* */

const InfoArea = ({
  className,
  space,
  children,
  position = 'bottom',
  variant,
  color,
  bgColor,
}) => (
  <InfoAreaWrapper
    className={className ? `infoArea ${className}` : 'infoArea'}
    $space={space}
    $position={position}
    $variant={variant}
    $color={color}
    $bgColor={bgColor}
  >
    { position === 'top' && <div className="polygon top" /> }
    { children }
    { position === 'bottom' && <div className="polygon bottom" /> }
  </InfoAreaWrapper>
);

export default InfoArea;
