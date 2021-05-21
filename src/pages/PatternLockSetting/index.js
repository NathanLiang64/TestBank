// import { useState } from 'react';
import { useCheckLocation, usePageInfo } from 'hooks';
import {
  FEIBButton, FEIBCheckbox, FEIBCheckboxLabel, FEIBSwitch,
} from 'components/elements';
import { useEffect, useState } from 'react';
import { patternLockSettingApi } from 'apis';
import PatternLockSettingWrapper from './patternLockSetting.style';
import NoticeArea from '../../components/NoticeArea';

const { init } = patternLockSettingApi;
const PatternLockSetting = () => {
  // const [nickname, setNickname] = useState('張大國');

  useCheckLocation();
  usePageInfo('/api/patternLockSetting');
  // const [initData, setinitData] = useState(null);
  const [switchCheck, setswitchCheck] = useState(false);
  const [checkBoxCheck, setcheckBoxCheck] = useState(false);

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
        <div>
          <NoticeArea title="圖形密碼登入使用條款" textAlign="left">
            <p>交易失敗相關文案(應由API回傳)</p>
          </NoticeArea>
        </div>
        <div>
          <FEIBCheckboxLabel
            control={(
              <FEIBCheckbox
                onChange={checkBoxChange}
              />
                  )}
            label="本人以閱讀並同意上述[圖形密碼登入]使用條款"
            labelPlacement="start"
          />
        </div>
        <FEIBButton disabled={!checkBoxCheck}>儲存變更</FEIBButton>
      </form>
    </PatternLockSettingWrapper>
  );
};

export default PatternLockSetting;
