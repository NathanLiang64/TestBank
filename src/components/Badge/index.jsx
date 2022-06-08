import BadgeWrapper from './Badge.style';

/*
* ==================== Accordion 組件說明 ====================
* 注意事項
* ==================== Accordion 可傳參數 ====================
* 1. color -> 如果要複寫預設的紫色。
* 2. label
* 3. value
* 4. children -> 如果要複寫預設的內文。
* */

const Badge = ({
  color, label, value, children,
}) => (
  <BadgeWrapper $color={color}>
    { children ?? (
      <>
        <div className="label">{label}</div>
        <div className="value">{value}</div>
      </>
    )}
  </BadgeWrapper>
);
export default Badge;
