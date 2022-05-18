import Animation from 'components/Animation';
import InfoArea from 'components/InfoArea';
import ProgressBar from 'components/ProgressBar';
import FEIBButton from 'components/elements/FEIBButton';

import DepositePlanWrapper from './DepositPlan.style';
import { getStage } from './DepositPlan.utils';

const DepositPlan = ({ currentValue = 0, targetValue = 100, expireDate }) => {
  const progressPercentage = Math.trunc((currentValue / targetValue) * 100);
  // Expected to get from API.
  const isPlanCompleted = progressPercentage >= 100;
  const isPlanFailed = progressPercentage < 100 && expireDate && new Date(expireDate) < new Date();
  const stage = getStage(isPlanFailed, progressPercentage);

  return (
    <DepositePlanWrapper>
      <div className="pad flex">
        <Animation data={stage.animation} height={169} width={312} />
        <InfoArea
          variant="top"
          position="top"
          space="auto"
          {...stage.infoAreaStyles}
        >
          {stage.text}
        </InfoArea>
        <ProgressBar value={progressPercentage} />
        {/* eslint-disable react/jsx-one-expression-per-line */}
        <div>目前金額 <em>{currentValue}萬</em>/{targetValue}萬</div>
        { expireDate && !isPlanCompleted && (<div>{expireDate}到期</div>)}
        {/* eslint-enable react/jsx-one-expression-per-line */}
      </div>
      {(isPlanCompleted || isPlanFailed) ? <FEIBButton className="mt-3">結束本計畫</FEIBButton> : (
        <div className="pad">
          <hr />
          <div>more</div>
        </div>
      )}
    </DepositePlanWrapper>
  );
};

export default DepositPlan;
