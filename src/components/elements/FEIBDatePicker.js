import styled from 'styled-components';
import { EventNoteRounded } from '@material-ui/icons';
import { KeyboardDatePicker as MaterialDatePicker } from '@material-ui/pickers';
import theme from 'themes/theme';

const FEIBDatePicker = styled(MaterialDatePicker).attrs({
  invalidDateMessage: '日期格式錯誤',
  format: 'yyyy/MM/dd',
  okLabel: '確定',
  cancelLabel: '取消',
  keyboardIcon: <EventNoteRounded style={{ color: theme.colors.primary.light }} />,
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
  
  .MuiIconButton-root {
    padding-right: .8rem;
  }

  .MuiSvgIcon-root {
    font-size: 2.5rem;
  }
  
  .MuiPickersToolbar-toolbar {
    background: red !important;
  }
`;

export default FEIBDatePicker;
