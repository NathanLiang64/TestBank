import { useSelector } from 'react-redux';
import Alert from 'components/Alert';
import PatternLockSettingWrapper from './patternLockSetting.style';

const PatternLockSetting2 = () => {
  const isFirstSetting = useSelector(({ patternLockSetting }) => patternLockSetting.isFirstSetting);
  const isActive = useSelector(({ patternLockSetting }) => patternLockSetting.isActive);
  const isResultSuccess = useSelector(({ patternLockSetting }) => patternLockSetting.isResultSuccess);

  const SuccessAlertWithContent = () => (
    <>
      <Alert state="success">設定成功</Alert>
      {
        isFirstSetting && isActive
          ? (
            <div>
              <p>您的圖形密碼登入已經啟用囉！</p>
              <p>下次登入 Bankee 時，可以使用圖形密碼進行快速登入囉！</p>
            </div>
          )
          : (
            <p>
              您的圖形密碼登入
              { isActive ? '已變更成功' : '功能取消'}
              囉！
            </p>
          )
      }
    </>
  );

  return (
    <PatternLockSettingWrapper inDialog>
      {
        isResultSuccess
          ? <SuccessAlertWithContent />
          : <Alert>設定失敗，請重新設定</Alert>
      }
      <div />
    </PatternLockSettingWrapper>
  );
};

export default PatternLockSetting2;
