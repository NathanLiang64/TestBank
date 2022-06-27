// import { useEffect, use } from 'react';

const PatternSetting = ({ showPattern, closePattern }) => {
  const close = () => closePattern();
  return (
    <div className={`patternSetting ${showPattern ? '' : 'hide'}`} onClick={close}>
      <div className="centerContainer">
        <div className="tip">請輸入圖形密碼</div>
        <div className="pointContainer">
          <div className="point" />
          <div className="point" />
          <div className="point" />
          <div className="point" />
          <div className="point" />
          <div className="point" />
          <div className="point" />
          <div className="point" />
          <div className="point" />
        </div>
      </div>
    </div>
  );
};

export default PatternSetting;
