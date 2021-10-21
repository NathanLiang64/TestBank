import styled from 'styled-components';
import { KeyboardDatePicker as MaterialDatePicker } from '@material-ui/pickers';
import { CalendarIcon } from 'assets/images/icons';
import theme from 'themes/theme';

const FEIBDatePicker = styled(MaterialDatePicker).attrs({
  invalidDateMessage: '日期格式錯誤',
  format: 'yyyy/MM/dd',
  okLabel: '確定',
  cancelLabel: '取消',
  keyboardIcon: <CalendarIcon />,
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
  }
  
  .MuiInputBase-input {
    padding-top: .6rem;
    padding-bottom: 1rem;
  }

  .Icon {
    top: -.4rem;
    right: -.1rem;
    font-size: 2rem;
  }
  
  .MuiPickersToolbar-toolbar {
    background: red !important;
  }
`;

export default FEIBDatePicker;
