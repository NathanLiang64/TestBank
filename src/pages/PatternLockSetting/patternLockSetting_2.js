import { useSelector } from 'react-redux';
import Alert from 'components/Alert';
import PatternLockSettingWrapper from './patternLockSetting.style';

const PatternLockSetting2 = () => {
  const type = useSelector(({ patternLockSetting }) => patternLockSetting.type);
  const isResultSuccess = useSelector(({ patternLockSetting }) => patternLockSetting.isResultSuccess);

  const textArea = () => {
    switch (type) {
      case 2:
        return (
          <div>
            <p>您的圖形密碼已變更成功囉！</p>
          </div>
        );
      case 3:
        return (
          <div>
            <p>您的圖形密碼登入功能取消囉！</p>

          </div>
        );
      default:
        return (
          <div>
            <p>您的圖形密碼登入已經啟用囉！</p>
            <p>下次登入 Bankee 時，可以使用圖形密碼進行快速登入囉！</p>
          </div>
        );
    }
  };

  const SuccessAlertWithContent = () => (
    <>
      <Alert state="success">設定成功</Alert>
      {
        textArea()
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
