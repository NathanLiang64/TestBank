import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useCheckLocation, usePageInfo } from 'hooks';
import { patternLockSettingApi } from 'apis';
import Dialog from 'components/Dialog';
import NoticeArea from 'components/NoticeArea';
import ConfirmButtons from 'components/ConfirmButtons';
import {
  FEIBButton, FEIBCheckbox, FEIBCheckboxLabel, FEIBInput, FEIBInputLabel, FEIBSwitch, FEIBSwitchLabel,
} from 'components/elements';
import theme from 'themes/theme';
import PatternLockSettingWrapper from './patternLockSetting.style';
import PatternLockSetting2 from './patternLockSetting_2';
import { setIsActive, setIsResultSuccess, setIsFirstSetting } from './stores/actions';

const { init } = patternLockSettingApi;
const PatternLockSetting = () => {
  // const [initData, setinitData] = useState(null);
  const [checkBoxCheck, setcheckBoxCheck] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const isActive = useSelector(({ patternLockSetting }) => patternLockSetting.isActive);

  const dispatch = useDispatch();

  useEffect(async () => {
    const data = await init();
    // setinitData(data.initData);
    dispatch(setIsActive(data.initData.isActive));
    dispatch(setIsFirstSetting(data.initData.isFirstSetting));
  }, []);

  const switchChange = () => {
    dispatch(setIsActive(!isActive));
  };

  const checkBoxChange = () => {
    setcheckBoxCheck((prev) => !prev);
  };

  const handleClickSaveChange = () => {
    // 開啟確認彈窗進行變更確認操作

    setShowConfirmDialog(true);
  };

  const handleClickConfirmMainButton = () => {
    // 關閉當前的確認彈窗
    setShowConfirmDialog(false);
    // call api 決定變更結果
    // eslint-disable-next-line no-restricted-globals
    const result = confirm('原生畫面');
    if (result) {
      dispatch(setIsResultSuccess(true));
      // 開啟顯示結果的彈窗
      setShowResultDialog(true);
    }
  };

  const handleClickResultMainButton = () => {
    // 關閉顯示結果的彈窗
    setShowResultDialog(false);
    // 回到個人化資料設定主頁
  };

  const ConfirmDialog = () => (
    <Dialog
      isOpen={showConfirmDialog}
      onClose={() => setShowConfirmDialog(false)}
      content={<p>您確定要變更圖形密碼設定嗎？</p>}
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
      content={<PatternLockSetting2 />}
      action={(
        <FEIBButton onClick={handleClickResultMainButton}>確定</FEIBButton>
      )}
    />
  );

  useCheckLocation();
  usePageInfo('/api/patternLockSetting');

  return (
    <PatternLockSettingWrapper>
      <form>
        <FEIBSwitchLabel
          control={(
            <FEIBSwitch
              checked={isActive}
              onChange={switchChange}
            />
          )}
          label="圖形密碼登入啟用"
          $hasBorder
        />
        <NoticeArea title="圖形密碼登入使用條款" textAlign="left" className="customBottomSpace">
          <p>
            1. 本人同意與遠東商銀約定以本手機做為登入遠東商銀行動銀行APP時身分認證之用。爾後欲取消約定時，將由本人登入後至
            <span className="textColorPrimary">服務設定➝圖形密碼登入設定/變更/取消</span>
            功能中設定。
          </p>
          <p>2. 為保障使用安全，本人以圖形密碼登入後僅查詢帳戶相關資料，如需執行交易類功能，將於交易過程中另行輸入網路銀行密碼。</p>
          <p>3. 圖形密碼登入連續三次錯誤時，系統將鎖住該功能，如欲重新使用，本人應於APP首頁以身分證字號、使用者代碼、網銀密碼登入後，進行解鎖。</p>
          <p>4. 圖形密碼請設定6~12個點(可重覆)。</p>
          <p>5. 本功能只提供本人之一台手機中設定，如於本人之其他手機中設定，則原手機設定將自動解除。</p>
          <p>6. 如果手機重置或重新安裝APP時，需要重新設定本功能。</p>
        </NoticeArea>
        <div className="agreeArea">
          <FEIBCheckboxLabel
            control={(
              <FEIBCheckbox
                onChange={checkBoxChange}
                color="default"
              />
            )}
            label="本人以閱讀並同意上述[圖形密碼登入]使用條款"
          />
        </div>
        <div>
          <FEIBInputLabel htmlFor="password">網銀密碼</FEIBInputLabel>
          <FEIBInput
            id="password"
            name="password"
            type="password"
            placeholder="請輸入您的網銀密碼"
            $color={theme.colors.primary.dark}
            $borderColor={theme.colors.primary.brand}
          />
        </div>
        <FEIBButton
          disabled={!checkBoxCheck}
          onClick={handleClickSaveChange}
          type="button"
        >
          儲存變更
        </FEIBButton>

        { showResultDialog ? <ResultDialog /> : <ConfirmDialog /> }
      </form>
    </PatternLockSettingWrapper>
  );
};

export default PatternLockSetting;
