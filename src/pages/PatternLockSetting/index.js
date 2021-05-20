// import { useState } from 'react';
import { useCheckLocation, usePageInfo } from 'hooks';
import { FEIBButton } from 'components/elements';
import PatternLockSettingWrapper from './patternLockSetting.style';

const PatternLockSetting = () => {
  // const [nickname, setNickname] = useState('張大國');

  useCheckLocation();
  usePageInfo('/api/patternLockSetting');

  return (
    <PatternLockSettingWrapper>
      <form>
        <div>
          {/* <FEIBSwitchLabel */}
          {/*  control={( */}
          {/*    <FEIBSwitch /> */}
          {/*  )} */}
          {/*  label="圖形密碼登入啟用" */}
          {/*  labelPlacement="start" */}
          {/* /> */}
        </div>
        <FEIBButton>確定送出</FEIBButton>
      </form>
    </PatternLockSettingWrapper>
  );
};

export default PatternLockSetting;
