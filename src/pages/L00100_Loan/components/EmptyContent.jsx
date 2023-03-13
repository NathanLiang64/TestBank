import FEIBButton from 'components/elements/FEIBButton';
import EmptyPlanWrapper from './EmptyContent.style';

const EmptyPlan = ({ onAddClick }) => (
  <EmptyPlanWrapper>
    <hr />

    <h2>一般信用貸款:</h2>
    <p>手續費NT$888元、利率1.98%起</p>

    <h2>挑戰型信用貸款:</h2>
    <p>手續費NT$8,888元、利率4%起</p>
    <p>挑戰月月繳款正常，最高返還所繳利息50%</p>

    <FEIBButton onClick={onAddClick}>新增一筆信用貸款</FEIBButton>
  </EmptyPlanWrapper>
);

export default EmptyPlan;
