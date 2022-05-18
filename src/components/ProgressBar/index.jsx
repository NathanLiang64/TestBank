/* eslint no-underscore-dangle: ["error", {"allow": ["_value"] }] */

import ProgressBarWrapper from './progressBar.style';

const ProgressBar = ({ value }) => {
  let _value = (value >= 94 && value < 100) ? 94 : value;
  _value = Math.max(0, Math.min(_value, 100));

  return (
    <ProgressBarWrapper>
      <div className="progress">
        <div className="bar" style={{ width: `${_value}%` }}>
          <div className="circle">{ value }</div>
        </div>
      </div>
      <div className="percent">%</div>
    </ProgressBarWrapper>
  );
};

export default ProgressBar;
