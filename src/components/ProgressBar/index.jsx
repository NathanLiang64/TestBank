/* eslint no-underscore-dangle: ["error", {"allow": ["_value"] }] */

import ProgressBarWrapper from './progressBar.style';

const ProgressBar = ({ value }) => {
  const _value = value > 94 ? 94 : value;

  return (
  <ProgressBarWrapper>
    <div className="progress">
      <div className="bar" style={{ width: `${_value}%` }}>
        <div className="circle">{ value }</div>
      </div>
    </div>
    <div className="percent">%</div>
  </ProgressBarWrapper>
  )
};

export default ProgressBar;
