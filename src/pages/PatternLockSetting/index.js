import { useEffect, useState } from 'react';
import { useCheckLocation, usePageInfo } from 'hooks';
import { patternLockSettingApi } from 'apis';
import Dialog from 'components/Dialog';
import NoticeArea from 'components/NoticeArea';
import {
  FEIBButton, FEIBCheckbox, FEIBCheckboxLabel, FEIBInput, FEIBInputLabel, FEIBSwitch,
} from 'components/elements';
import theme from 'themes/theme';
import PatternLockSettingWrapper from './patternLockSetting.style';
import PatternLockSetting2 from './patternLockSetting_2';

const { init } = patternLockSettingApi;
const PatternLockSetting = () => {
  // const [nickname, setNickname] = useState('張大國');
  // const [initData, setinitData] = useState(null);
  const [switchCheck, setswitchCheck] = useState(false);
  const [checkBoxCheck, setcheckBoxCheck] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(async () => {
    const data = await init();
    // setinitData(data.initData);
    setswitchCheck(data.initData.switchCheck);
  }, []);

  const switchChange = () => {
    setswitchCheck((prev) => !prev);
  };

  const checkBoxChange = () => {
    setcheckBoxCheck((prev) => !prev);
  };

  const handleClickSaveChange = () => {
    setOpenDialog(true);
  };

  const handleClickDialogButton = () => {
    setOpenDialog(false);
    // 回到個人化資料設定主頁
  };

  useCheckLocation();
  usePageInfo('/api/patternLockSetting');

  return (
    <PatternLockSettingWrapper>
      <form>
        <div>
          <FEIBCheckboxLabel
            control={(
              <FEIBSwitch
                checked={switchCheck}
                onChange={switchChange}
              />
            )}
            label="圖形密碼登入啟用"
            labelPlacement="start"
          />
        </div>
        <NoticeArea title="圖形密碼登入使用條款" textAlign="left" className="customBottomSpace">
          <p>顯示相關條款內容</p>
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

        <Dialog
          isOpen={openDialog}
          onClose={() => setOpenDialog(false)}
          content={<PatternLockSetting2 />}
          action={<FEIBButton onClick={handleClickDialogButton}>確定</FEIBButton>}
        />
      </form>
    </PatternLockSettingWrapper>
  );
};

export default PatternLockSetting;
