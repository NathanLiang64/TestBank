import { useState } from 'react';
// import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';

/* Elements */
import {
  FEIBSwitch,
  FEIBInputLabel,
  FEIBInput,
  FEIBButton,
  FEIBCheckboxLabel,
  FEIBCheckbox,
  FEIBSwitchLabel,
} from 'components/elements';
import Dialog from 'components/Dialog';
import NoticeArea from 'components/NoticeArea';
import ConfirmButtons from 'components/ConfirmButtons';
import Alert from 'components/Alert';

/* Styles */
import theme from 'themes/theme';
import FingerPrintWrapper from './fingerPrint.style';

const FingerPrint = () => {
  // const history = useHistory();
  const [isActive, setIsActive] = useState(false);
  const [agree, setAgree] = useState(false);
  const [password, setPassword] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);

  const handleSwitchChange = () => {
    setIsActive((prev) => !prev);
  };

  const handleCheckBoxChange = () => {
    setAgree((prev) => !prev);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSaveChange = () => {
    setShowConfirmDialog(true);
  };

  const handleClickConfirmMainButton = () => {
    setShowConfirmDialog(false);
    setShowResultDialog(true);
  };

  const handleClickResultMainButton = () => {
    setShowResultDialog(false);
  };

  const ConfirmDialog = () => (
    <Dialog
      isOpen={showConfirmDialog}
      onClose={() => setShowConfirmDialog(false)}
      content={<p>您確定要變更生物辨識登入設定嗎？</p>}
      action={(
        <ConfirmButtons
          mainButtonOnClick={handleClickConfirmMainButton}
          subButtonOnClick={() => setShowConfirmDialog(false)}
        />
      )}
    />
  );

  const ResultDialog = () => (
    <Dialog
      isOpen={showResultDialog}
      onClose={() => setShowResultDialog(false)}
      content={(
        <>
          <Alert state="success">設定成功</Alert>
          {
            isActive
              ? (
                <div>
                  <p>您的生物辨識登入已經啟用囉！</p>
                  <p>下次登入 Bankee 時，可以使用生物辨識進行快速登入囉！</p>
                </div>
              )
              : (
                <p>
                  您的生物辨識登入
                  { isActive ? '已變更成功' : '功能取消'}
                  囉！
                </p>
              )
          }
        </>
      )}
      action={(
        <FEIBButton onClick={handleClickResultMainButton}>確定</FEIBButton>
      )}
    />
  );

  useCheckLocation();
  usePageInfo('/api/fingerPrintLockSetting');

  return (
    <FingerPrintWrapper>
      <FEIBSwitchLabel
        control={(
          <FEIBSwitch
            checked={isActive}
            onChange={handleSwitchChange}
          />
        )}
        label="生物辨識登入啟用"
        $hasBorder
      />
      <NoticeArea title="指紋/臉部辨識登入使用條款" textAlign="left" className="customNoticeArea">
        <p>
          1. 本人同意與遠東商銀約定以本手機做為登入遠東商銀行動銀行APP時身分認證之用。爾後欲取消約定時，將由本人登入後至
          <span className="textColorPrimary">服務設定 ➝ 指紋/臉部辨識登入設定/取消</span>
          功能中設定。
        </p>
        <p>2. 本人了解本手機所有已設定之指紋/臉部辨識(包含但不限本人)，皆可以本約定之手機登入遠東商銀行動銀行APP，將會謹慎使用，本手機若有本人以外之指紋/臉部辨識者，將變更為本人之指紋/臉部辨識。</p>
        <p>3. 請勿任意破解手機(越獄或Root)並慎防駭客攻擊，以確保帳戶安全。如因第三人冒用或盜用本功能以致損害時，本人應自行負責。</p>
        <p>4. 遠東商銀非手機內建指紋/臉部辨識功能之製造者，且與該手機製造廠商並無任何代理或合夥關係，如手機指紋/臉部辨識功能發生任何問題，請洽詢手機製造廠商處理。</p>
        <p>5. 為保障使用安全，本人以指紋/臉部辨識登入後僅查詢帳戶相關資料，如需執行交易類功能，將於交易過程中另行輸入網路銀行密碼。</p>
        <p>
          6. 指紋辨識登入連續三次錯誤時，系統將鎖住該功能，如欲重新使用，本人應於APP首頁以身分證字號、使用者代碼、網銀密碼登入後，進行解鎖。 (如您使用iphone手機，則需前往手機
          <span className="textColorPrimary">設定 ➝ Touch ID與密碼</span>
          將Touch ID解鎖。)
        </p>
        <p>
          7. 臉部辨識登入功能僅限iphoneX及其後iphone新出之具備Face ID功能手機使用。當臉部辨識登入因連續錯誤多次(三次以上)導致鎖住iphone臉部辨識(Face ID)登入功能時，系統將鎖住該功能，如欲重新使用，需前往手機
          <span className="textColorPrimary">設定 ➝ Face ID 與密碼</span>
          將Face ID解鎖，再至APP首頁以身分證字號、使用者代碼、網銀密碼登入後方能解鎖。
        </p>
        <p>8. 本功能只提供本人之一台手機中設定，如於本人之其他手機中設定，則原手機設定將自動解除。</p>
        <p>9. 手機重置或重新安裝APP時，需要重新設定本功能</p>
      </NoticeArea>
      <FEIBCheckboxLabel
        control={(
          <FEIBCheckbox
            color="default"
            $iconColor={theme.colors.primary.brand}
            onChange={handleCheckBoxChange}
            checked={agree}
          />
        )}
        label="本人已閱讀並同意上述[指紋/臉部辨識登入]使用條款"
      />
      <FEIBInputLabel style={{ marginTop: '2rem' }}>網銀密碼</FEIBInputLabel>
      <FEIBInput
        type="password"
        name="password"
        value={password}
        placeholder="請輸入您的網銀密碼"
        $color={theme.colors.primary.dark}
        $borderColor={theme.colors.primary.brand}
        onChange={handlePasswordChange}
      />
      <FEIBButton
        disabled={!agree}
        onClick={handleSaveChange}
      >
        儲存變更
      </FEIBButton>
      { showResultDialog ? <ResultDialog /> : <ConfirmDialog /> }
    </FingerPrintWrapper>
  );
};

export default FingerPrint;
