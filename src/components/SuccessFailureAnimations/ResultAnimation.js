import Lottie from 'lottie-react';

import SuccessFlower from 'assets/animations/success1_flower.json';
import SuccessLove from 'assets/animations/success2_love.json';
import SuccessCheer from 'assets/animations/success3_cheer.json';
import SuccessMusic from 'assets/animations/success4_music.json';
import Fail from 'assets/animations/fail.json';

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

  const getAnimation = () => {
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
        <Lottie animationData={getAnimation()} loop />
      </div>
      <h3 className={`stateText ${isSuccess ? 'success' : 'error'}`}>
        {subject}
      </h3>
      { (descHeader || description) ? (
        <section className={`errorInfo ${errorSpace ? 'horizontalSpacing' : ''}`}>
          { descHeader ? (<p className="errorCode">{(isSuccess ? '' : '錯誤代碼：') + descHeader}</p>) : null }
          { description ? (<p className="errorText">{description}</p>) : null }
        </section>
      ) : null }
    </SuccessFailureAnimationsWrapper>
  );
};

export default ResultAnimation;
