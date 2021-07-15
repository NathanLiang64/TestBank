import styled from 'styled-components';
import TodayIcon from '@material-ui/icons/Today';
import { KeyboardDatePicker as MaterialDatePicker } from '@material-ui/pickers';
import theme from 'themes/theme';

const FEIBDatePicker = styled(MaterialDatePicker).attrs({
  invalidDateMessage: '日期格式錯誤',
  format: 'yyyy/MM/dd',
  okLabel: '確定',
  cancelLabel: '取消',
  keyboardIcon: <TodayIcon style={{ color: theme.colors.primary.dark }} fontSize="large" />,
})`
  .MuiInputBase-root {
    margin-top: .4rem;
    // margin-bottom: ${({ $bottomSpace }) => ($bottomSpace === false && '0') || '2rem'};
    font-size: ${({ $fontSize }) => ($fontSize && `${$fontSize}rem`) || '1.4rem'};
    color: ${({ $color }) => $color || theme.colors.primary.dark};
    &.MuiInput-underline {
      &:before,
      &:hover:not(.Mui-disabled):before {
        border-color: ${({ $borderColor }) => $borderColor || theme.colors.primary.dark};
        opacity: .6;
      }
      &:after {
        border-color: ${({ $borderColor, $focusBorderColor }) => $focusBorderColor || $borderColor || 'inherit'};
      }
    }
    .MuiIconButton-root {
      padding: 0;
    }
  }
  
  .MuiPickersToolbar-toolbar {
    background: red !important;
  }
`;

export default FEIBDatePicker;
