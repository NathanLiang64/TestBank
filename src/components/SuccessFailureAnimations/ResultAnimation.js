import SuccessCheer from 'assets/animations/successCheer.gif';
import SuccessFlower from 'assets/animations/successFlower.gif';
import SuccessLove from 'assets/animations/successLove.gif';
import SuccessMusic from 'assets/animations/successMusic.gif';
import Fail from 'assets/animations/fail.gif';

import SuccessFailureAnimationsWrapper from './successFailureAnimations.style';

/**
 * 顯示成功或失敗的動畫及下方標準訊息。
 * @param {{
    isSuccess: '{boolean} 表示成功或失敗的旗標',
    subject: '{*} 表示結果的主要原因描述，當成功時為綠色、失敗則以紅色顯示',
    descHeader: '{*} 詳細說明的主題',
    description: '{*} 詳細說明的內容',
 * }}
 */
const ResultAnimation = ({
  isSuccess,
  subject,
  descHeader,
  description,
}) => {
  const errorSpace = true;

  const animationData = () => {
    if (isSuccess) {
      switch (Math.floor(Math.random() * 4)) {
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
        <img src={animationData()} alt="animation" />
      </div>
      <h3 className={`stateText ${isSuccess ? 'success' : 'error'}`}>
        {subject}
      </h3>
      { (descHeader || description) ? (
        <section className={`errorInfo ${errorSpace ? 'horizontalSpacing' : ''}`}>
          { descHeader ? (<div className="errorCode">{(isSuccess ? '' : '錯誤代碼：') + descHeader}</div>) : null }
          { description ? (<div className="errorText">{description}</div>) : null }
        </section>
      ) : null }
    </SuccessFailureAnimationsWrapper>
  );
};

export default ResultAnimation;
