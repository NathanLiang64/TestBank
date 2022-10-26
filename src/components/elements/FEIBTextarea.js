import styled from 'styled-components';
import { TextareaAutosize } from '@material-ui/core';

/*
* ==================== FEIBTextarea 可用選項 ====================
* 1. $color -> 文字顏色
*    填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)
* 2. $borderColor -> 框線顏色
*    填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)
* */

const FEIBTextarea = styled(TextareaAutosize)`
  color: ${({ $color, theme }) => $color || theme.colors.primary.dark};
  width: 100%;
  border-radius: .6rem;
  border-color: ${({ $borderColor, theme }) => {
    console.log($borderColor, theme);
    return $borderColor || theme.colors.border.light;
  }};
  font-size: 1.6rem;
  line-height: 2.4rem;
  padding: .8rem;
  resize: none;
  outline: none;
`;

export default FEIBTextarea;
