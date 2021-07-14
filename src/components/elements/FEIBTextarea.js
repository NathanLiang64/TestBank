import styled from 'styled-components';
import { TextareaAutosize } from '@material-ui/core';

/*
* ==================== FEIBTextarea 可用選項 ====================
* 1. $color -> 文字顏色
*    填寫包含 # 符號的色碼 (建議直接使用 theme.js 內的全域變數)
* */
const FEIBTextarea = styled(TextareaAutosize)`
  color: ${({ theme }) => theme.colors.primary.dark};
  width: 100%;
  border-radius: .6rem;
  border-color: #999;
  font-size: 1.6rem;
  line-height: 2.4rem;
  padding: .8rem;
  outline: none;
`;

export default FEIBTextarea;
