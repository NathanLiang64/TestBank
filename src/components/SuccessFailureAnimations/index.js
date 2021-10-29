import Animation from 'components/Animation';
import SuccessAnimation from 'assets/animations/successFlower.json';
import FailAnimation from 'assets/animations/fail.json';
import SuccessFailureAnimationsWrapper from './successFailureAnimations.style';

/*
* ============ SuccessFailureAnimations 組件說明 =============
* SuccessFailureAnimations 組件再次封裝了 Animation 組件
* 根據傳入參數可替換成功和失敗動畫
* ============ SuccessFailureAnimations 可傳參數 =============
* 1. isSuccess -> 判斷成功與否之條件
* 2. successTitle -> 成功標題
* 3. errorTitle -> 失敗標題
* 4. errorCode -> 失敗時顯示之錯誤代碼
* 5. errorDesc -> 失敗時顯示之文字資訊
* 6. errorSpace -> 失敗時 ErrorInfo 左右留白間距 (成功失敗畫面顯示於頁面時用、顯示於彈窗時不需傳入)
* 7. children -> 成功時顯示其它資訊，不需設置 children 屬性，直接在標籤內部撰寫 jsx
* */

const SuccessFailureAnimations = ({
  isSuccess,
  successTitle = '成功',
  errorTitle = '失敗',
  errorCode = '-',
  errorDesc,
  errorSpace,
  children,
}) => {
  const renderErrorInfo = (code, desc) => (
    <section className={`errorInfo ${errorSpace ? 'horizontalSpacing' : ''}`}>
      <p className="errorCode">
        錯誤代碼：
        {code}
      </p>
      <p className="errorText">{desc}</p>
    </section>
  );

  return (
    <SuccessFailureAnimationsWrapper>
      <Animation data={isSuccess ? SuccessAnimation : FailAnimation} />
      <h3 className={`stateText ${isSuccess ? 'success' : 'error'}`}>
        {isSuccess ? successTitle : errorTitle}
      </h3>
      {isSuccess ? children : renderErrorInfo(errorCode, errorDesc)}
    </SuccessFailureAnimationsWrapper>
  );
};

export default SuccessFailureAnimations;
