import { useSelector } from 'react-redux';
import Alert from 'components/Alert';
import PatternLockSettingWrapper from './patternLockSetting.style';

const PatternLockSetting2 = () => {
  const isResultSuccess = useSelector(({ lossReissue }) => lossReissue.isResultSuccess);

  return (
    <PatternLockSettingWrapper inDialog>
      {
        isResultSuccess
          ? <Alert state="success">設定成功</Alert>
          : <Alert>設定失敗，請重新設定</Alert>
      }
      <div>
        <p>您的圖形密碼登入已啟用</p>
        <p>下次登入Bankee時，可以使用圖形密碼進行快速登入囉！</p>
      </div>
    </PatternLockSettingWrapper>
  );
};

export default PatternLockSetting2;
