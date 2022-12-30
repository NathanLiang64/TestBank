/* eslint-disable no-unused-vars */
import Lottie from 'lottie-react';

import SuccessFlower from 'assets/animations/success1_flower.json';
import SuccessLove from 'assets/animations/success2_love.json';
import SuccessCheer from 'assets/animations/success3_cheer.json';
import SuccessMusic from 'assets/animations/success4_music.json';
import Fail from 'assets/animations/fail.json';

// svg
// import SuccessCheer from 'assets/animations/successCheer.svg';
// import SuccessFlower from 'assets/animations/successFlower.svg';
// import SuccessLove from 'assets/animations/successLove.svg';
// import SuccessMusic from 'assets/animations/successMusic.svg';
// import FailAnimation from 'assets/animations/fail.svg';

import SuccessFailureAnimationsWrapper from './successFailureAnimations.style';

/*
* ============ SuccessFailureAnimations 組件說明 =============
* SuccessFailureAnimations 組件再次封裝了 Animation 組件
* 根據傳入參數可替換成功和失敗動畫
* ============ SuccessFailureAnimations 可傳參數 =============
* 1. isSuccess -> 判斷成功與否之條件
* 2. successTitle -> 成功標題
* 3. successDesc -> 成功時顯示之文字訊息，可傳 HTML
* 4. errorTitle -> 失敗標題
* 5. errorCode -> 失敗時顯示之錯誤代碼
* 6. errorDesc -> 失敗時顯示之文字資訊
* 7. errorSpace -> 失敗時 ErrorInfo 左右留白間距 (成功失敗畫面顯示於頁面時用、顯示於彈窗時不需傳入)
* 8. children -> 成功時顯示其它資訊，不需設置 children 屬性，直接在標籤內部撰寫 jsx
* */

const SuccessFailureAnimations = ({
  isSuccess,
  successTitle = '成功',
  successDesc,
  errorTitle = '失敗',
  errorCode,
  errorDesc,
  errorSpace,
  children,
}) => {
  const renderSuccessInfo = (desc) => (
    <section className="successInfo">
      { desc }
    </section>
  );

  const renderErrorInfo = (code, desc) => (
    <section className={`errorInfo ${errorSpace ? 'horizontalSpacing' : ''}`}>
      {
        code && (
          <div className="errorCode">
            錯誤代碼：
            {code}
          </div>
        )
      }
      <div className="errorText">{desc}</div>
    </section>
  );

  const animationData = () => {
    if (isSuccess) {
      switch (Math.floor(Math.random() * (3))) {
        case 0:
          return SuccessMusic;
        case 1:
          return SuccessLove;
        case 2:
          return SuccessCheer;
        case 3:
        default:
          return SuccessFlower;
      }
    }
    return Fail;
  };

  return (
    <SuccessFailureAnimationsWrapper>
      <div className="animContainer">
        <Lottie animationData={animationData()} loop />
      </div>
      <h3 className={`stateText ${isSuccess ? 'success' : 'error'}`}>
        {isSuccess ? successTitle : errorTitle}
      </h3>
      { isSuccess && successDesc ? renderSuccessInfo(successDesc) : null }
      { isSuccess ? children : renderErrorInfo(errorCode, errorDesc) }
    </SuccessFailureAnimationsWrapper>
  );
};

export default SuccessFailureAnimations;
