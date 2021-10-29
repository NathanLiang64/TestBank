import Lottie from 'react-lottie';

/*
* ==================== Animation 組件說明 ====================
* Animation 組件封裝了 LottieFile 的動畫呈現套件
* ==================== Animation 可傳參數 ====================
* 1. data -> 動畫檔案 (.json)
* 2. width -> 寬度，可輸入數字，預設 124
* 3. height -> 高度，可輸入數字，預設 120
* */

const Animation = ({
  data,
  width = 124,
  height = 120,
}) => {
  const animationOptions = {
    loop: true,
    autoplay: true,
    animationData: data,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <Lottie options={animationOptions} width={width} height={height} />
  );
};

export default Animation;
