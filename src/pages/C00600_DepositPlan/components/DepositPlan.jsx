import Animation from 'components/Animation';
import InfoArea from 'components/InfoArea';
import ProgressBar from 'components/ProgressBar';
import FEIBButton from 'components/elements/FEIBButton';
import ThreeColumnInfoPanel from 'components/ThreeColumnInfoPanel';
import ArrowNextButton from 'components/ArrowNextButton';

import DepositPlanWrapper from './DepositPlan.style';
import { getStage } from './DepositPlan.utils';

/*
* ==================== DepositPlan 組件說明 ====================
* 存錢計畫下方資訊卡
* ==================== DepositPlan 可傳參數 ====================
* 1. currentValue: number -> 目前金額，單位為「萬」。
* 2. targetValue: number -> 目標金額，單位為「萬」。
* 3. expireDate: string -> YYYY-MM-DD
* 4. bonusInfo: object[] -> [{ label: string, value: string }, ...]
* 5. showDetails: function -> 點擊「存錢歷程」觸發。
* */

const stringToDate = (dateStr) => {
  const d = [...dateStr.match(/(\d{4})(\d{2})(\d{2})/)];
  d.shift();
  return new Date(...d);
};

const formatedDateString = (dateStr, deliminator = '.') => {
  const d = [...dateStr.match(/(\d{4})(\d{2})(\d{2})/)];
  d.shift();
  return d.join(deliminator);
};

const DepositPlan = ({
  currentValue = 0,
  targetValue = 100,
  expireDate,
  bonusInfo,
  showDetails,
}) => {
  const progressPercentage = Math.trunc((currentValue / targetValue) * 100);
  const isPlanCompleted = progressPercentage >= 100;
  const isPlanFailed = progressPercentage < 100 && expireDate && stringToDate(expireDate) < new Date();
  const stage = getStage(isPlanFailed, progressPercentage);

  return (
    <DepositPlanWrapper>
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
        { expireDate && !isPlanCompleted && (<div>{formatedDateString(expireDate)}到期</div>)}
        {/* eslint-enable react/jsx-one-expression-per-line */}
      </div>
      {(isPlanCompleted || isPlanFailed) ? <FEIBButton className="mt-3">結束本計畫</FEIBButton> : (
        <div className="pad">
          <hr />
          <ThreeColumnInfoPanel isLoading={!bonusInfo} content={bonusInfo} />
          <ArrowNextButton onClick={showDetails}>存錢歷程</ArrowNextButton>
        </div>
      )}
    </DepositPlanWrapper>
  );
};

export default DepositPlan;
