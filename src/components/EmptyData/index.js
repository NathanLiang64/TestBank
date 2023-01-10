import { EmptyDataIcon } from 'assets/images/icons';
import theme from 'themes/theme';
import EmptyDataWrapper from './emptyData.style';

/*
* ==================== Empty 組件說明 ====================
* 無資料可顯示時請套用此組件
* ==================== Empty 可傳參數 ====================
* content -> string：顯示於圖案下方的文字，預設為 '搜尋條件無資料'
* color -> string：圖案及文字顏色，預設為 text.light (#6F89B2)
* icon -> boolean：是否顯示圖案，預設為true
* height -> string：EmptyData container高度，預設為40vh。圖案及文字會垂直置中微偏上。傳入時須包含單位。
* */

const EmptyData = ({
  content, color, icon = true, height = '40vh',
}) => (
  <EmptyDataWrapper $color={color} $height={height}>
    <div className="emptyDataIconWrapper">
      { icon && <EmptyDataIcon color={color || theme.colors.text.light} />}
      <p>{content === undefined ? '搜尋條件無資料' : content}</p>
    </div>
  </EmptyDataWrapper>
);

export default EmptyData;
