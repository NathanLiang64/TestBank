import { EmptyDataIcon } from 'assets/images/icons';
import theme from 'themes/theme';
import EmptyDataWrapper from './emptyData.style';

/*
* ==================== Empty 組件說明 ====================
* 無資料可顯示時請套用此組件
* ==================== Empty 可傳參數 ====================
* 無
* */

const EmptyData = ({
  content, color, icon = true,
}) => (
  <EmptyDataWrapper $color={color}>
    { icon && <EmptyDataIcon color={color || theme.colors.text.light} />}
    <p>{content || '搜尋條件無資料'}</p>
  </EmptyDataWrapper>
);

export default EmptyData;
