import { useEffect } from 'react';
import FEIBButton from 'components/elements/FEIBButton';
import EmptyPlanWrapper from './EmptyPlan.style';

const EmptyPlan = ({ onAddClick, onMount }) => {
  useEffect(() => {
    if (onMount && typeof onMount === 'function') {
      onMount();
    }
  });

  return (
    <EmptyPlanWrapper>
      <h2>存錢計畫須知</h2>
      <p>用戶只能同時存在3個存錢計畫，新增存錢計畫前，請先完成已設定的存錢計畫</p>
      <p>需要有空的子帳號才可以綁定存錢計畫，請先關閉帳本上子帳戶，或完成已設定的存錢計畫。</p>
      <FEIBButton onClick={onAddClick}>新增存錢計畫</FEIBButton>
    </EmptyPlanWrapper>
  );
};

export default EmptyPlan;
