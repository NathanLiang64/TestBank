import { useState } from 'react';

/* Elements */
import Header from 'components/Header';
import {
  FEIBSwitch,
  FEIBSwitchLabel,
  FEIBButton,
} from 'components/elements';
import Accordion from 'components/Accordion';
import Dialog from 'components/Dialog';
import { EditRounded } from '@material-ui/icons';
// eslint-disable-next-line no-unused-vars
import PatternSetting from './patternSetting';

/* Styles */
import QuickLoginSettingWrapper from './quickLoginSetting.style';

const QuickLoginSetting = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [currentType, setCurrentType] = useState('');
  const [isBioActive, setIsBioActive] = useState(false);
  const [isPatternActive, setIsPatternActive] = useState(false);
  const [showPattern, setShowPattern] = useState(false);
  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleBioSwitchChange = () => {
    if (isPatternActive) {
      setCurrentType('圖形辨識');
      setIsPatternActive(false);
      handleDialogOpen();
    }
    setIsBioActive((prev) => !prev);
  };

  const handlePatternActiveChange = () => {
    if (isBioActive) {
      setCurrentType('生物辨識');
      setIsBioActive(false);
      handleDialogOpen();
    }
    if (!isPatternActive) {
      setShowPattern(true);
    }
    setIsPatternActive((prev) => !prev);
  };

  const closePattern = () => setShowPattern(false);

  const renderDialog = () => (
    <Dialog
      isOpen={openDialog}
      onClose={() => setOpenDialog(false)}
      content={(
        <p>
          生物辨識與圖形辨識僅能擇一使用，將關閉
          {currentType}
          服務，如欲使用
          {currentType}
          請重新開啟服務。
        </p>
      )}
      action={(
        <FEIBButton onClick={() => setOpenDialog(false)}>確認</FEIBButton>
      )}
    />
  );

  return (
    <>
      <Header title="快速登入設定" />
      <QuickLoginSettingWrapper>
        <div className="tip">設定後就能快速登入囉！（僅能擇一）</div>
        <div>
          <div className="switchContainer">
            <FEIBSwitchLabel
              control={(
                <FEIBSwitch
                  checked={isBioActive}
                  onChange={handleBioSwitchChange}
                />
              )}
              label="生物辨識設定"
            />
          </div>
          <div className="switchContainer">
            <FEIBSwitchLabel
              control={(
                <FEIBSwitch
                  checked={isPatternActive}
                  onChange={handlePatternActiveChange}
                />
              )}
              label="圖形辨識設定"
            />
            <div className={`mainBlock ${!isPatternActive && 'hide'}`} onClick={() => setShowPattern(true)}>
              <div className="text">
                圖形辨識變更
              </div>
              <EditRounded />
            </div>
          </div>
        </div>
        <div className="agreeTip">
          啟用快速登入表示您同意以下使用條款
        </div>
        <Accordion title="使用條款">
          <ol>
            <li>本人同意與遠東商銀約定以本手機做為登入遠東商銀行動銀行APP時身分認證之用。爾後欲取消約定時，將由本人登入後至「服務設定&gt;圖形密碼登入設定/變更/取消」功能中設定。</li>
            <li>為保障使用安全，本人以圖形密碼登入後僅查詢帳戶相關資料，如需執行交易類功能，將於交易過程中另行輸入網路銀行密碼。</li>
            <li>圖形密碼登入連續三次錯誤時，系統將鎖住該功能，如欲重新使用，本人應於APP首頁以身分證字號、使用者代碼、網銀密碼登入後，進行解鎖。</li>
            <li>圖形密碼請設定6~12個點(可重覆)。</li>
            <li>本功能只提供本人之一台手機中設定，如於本人之其他手機中設定，則原手機設定將自動解除。</li>
            <li>如果手機重置或重新安裝APP時，需要重新設定本功能。</li>
          </ol>
        </Accordion>
        <PatternSetting showPattern={showPattern} closePattern={closePattern} />
        {
          renderDialog()
        }
      </QuickLoginSettingWrapper>
    </>
  );
};

export default QuickLoginSetting;
