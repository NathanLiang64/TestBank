import styled from 'styled-components';
import { TextareaAutosize } from '@material-ui/core';

/*
* ==================== FEIBTextarea 可用選項 ====================
* 1. $color -> 文字顏色
*    填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)
* */
const FEIBTextarea = styled(TextareaAutosize)`
  color: ${({ $color }) => `${$color} !important` || 'inherit'};
  width: 100%;
`;

export default FEIBTextarea;
