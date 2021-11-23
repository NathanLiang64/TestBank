import styled from 'styled-components';
import { KeyboardDatePicker as MaterialDatePicker } from '@material-ui/pickers';
import { CalendarIcon } from 'assets/images/icons';

const FEIBDatePicker = styled(MaterialDatePicker).attrs({
  invalidDateMessage: '日期格式錯誤',
  format: 'yyyy/MM/dd',
  okLabel: '確定',
  cancelLabel: '取消',
  keyboardIcon: <CalendarIcon size={24} />,
})`
  &.MuiTextField-root {
    justify-content: flex-end;
    height: 4rem;
  }
  
  .MuiInputBase-root {
    margin-top: .4rem;
    // margin-bottom: ${({ $bottomSpace }) => ($bottomSpace === false && '0') || '2rem'};
    font-size: ${({ $fontSize }) => ($fontSize && `${$fontSize}rem`) || '1.4rem'};
    color: ${({ $color, theme }) => $color || theme.colors.primary.dark};

    &.MuiInput-underline {
      &:before,
      &:hover:not(.Mui-disabled):before {
        border-color: ${({ $borderColor, theme }) => $borderColor || theme.colors.border.light};
        //opacity: .6;
      }
      &:after {
        border-width: .1rem;
        border-color: ${({ $borderColor, $focusBorderColor }) => $focusBorderColor || $borderColor || 'inherit'};
      }

      &.Mui-error:after {
        border-width: .1rem;
        border-color: ${({ theme }) => theme.colors.state.danger};
      }
    }
  }
  
  .MuiInputBase-input {
    padding-top: .6rem;
    padding-bottom: 1rem;
  }

  .Icon {
    top: -.5rem;
    //right: -.1rem;
    font-size: 2rem;
  }
  
  .MuiPickersToolbar-toolbar {
    background: red !important;
  }
`;

export default FEIBDatePicker;
