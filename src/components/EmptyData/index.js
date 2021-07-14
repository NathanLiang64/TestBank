import EmptyDataIcon from 'assets/images/icons/emptyData.svg';
import EmptyDataWrapper from './emptyData.style';

/*
* ==================== Empty 組件說明 ====================
* 無資料可顯示時請套用此組件
* ==================== Empty 可傳參數 ====================
* 無
* */

const EmptyData = () => (
  <EmptyDataWrapper>
    <img src={EmptyDataIcon} alt="Empty Data" />
    <p>搜尋條件無資料</p>
  </EmptyDataWrapper>
);

export default EmptyData;
