import { useState } from 'react';
import { useCheckLocation, usePageInfo } from 'hooks';
import { FEIBButton, FEIBInput, FEIBInputLabel } from 'components/elements';
import theme from 'themes/theme';
import NicknameSettingWrapper from './nicknameSetting.style';

const NicknameSetting = () => {
  const [nickname, setNickname] = useState('張大國');

  useCheckLocation();
  usePageInfo('/api/nicknameSetting');

  return (
    <NicknameSettingWrapper>
      <form>
        <div>
          <FEIBInputLabel $color={theme.colors.primary.brand}>暱稱</FEIBInputLabel>
          <FEIBInput
            type="currentNickname"
            name="currentNickname"
            value={nickname}
            $color={theme.colors.primary.dark}
            $borderColor={theme.colors.primary.brand}
            onChange={(event) => setNickname(event.target.value)}
          />
        </div>
        <FEIBButton>確定送出</FEIBButton>
      </form>
    </NicknameSettingWrapper>
  );
};

export default NicknameSetting;
