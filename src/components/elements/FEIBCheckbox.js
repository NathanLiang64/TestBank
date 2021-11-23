import styled from 'styled-components';
import { Checkbox as MaterialCheckbox } from '@material-ui/core';
import { CheckboxCheckedIcon, CheckboxUncheckedIcon } from 'assets/images/icons';

/*
* ==================== FEIBCheckbox 可用選項 ====================
* 1. $iconColor -> 圖標顏色
*    填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)，預設深藍灰色
* */

const FEIBCheckbox = styled(MaterialCheckbox).attrs({
  color: 'default',
  icon: <CheckboxUncheckedIcon size={24} />,
  checkedIcon: <CheckboxCheckedIcon size={24} />,
})`
  &.MuiCheckbox-root {
    color: ${({ theme, $iconColor }) => $iconColor || theme.colors.text.dark};

    &.Mui-checked {
      color: ${({ theme, $iconColor }) => $iconColor || theme.colors.primary.dark};
    }
  }
`;

export default FEIBCheckbox;
