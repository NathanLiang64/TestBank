import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { createMuiTheme } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import zhTW from 'date-fns/locale/zh-TW';
import { ThemeProvider } from '@material-ui/styles';
import theme from 'themes/theme';

const materialTheme = createMuiTheme({
  overrides: {
    MuiFormControlRoot: {
      background: 'red',
    },
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: theme.colors.primary.brand,
      },
    },
    MuiPickersCalendarHeader: {
      switchHeader: {
        backgroundColor: 'white',
        color: '#1b5e20',
      },
    },
    MuiPickersYear: {
      yearSelected: {
        color: theme.colors.primary.brand,
        '&:hover': {
          color: theme.colors.primary.brand,
        },
      },
    },
    MuiPickersDay: {
      daySelected: {
        backgroundColor: theme.colors.primary.brand,
        '&:hover': {
          backgroundColor: theme.colors.primary.brand,
        },
      },
    },
    MuiButton: {
      textPrimary: {
        color: theme.colors.primary.brand,
      },
    },
  },
});

const PickersProvider = ({ children }) => (
  <MuiPickersUtilsProvider utils={DateFnsUtils} locale={zhTW}>
    <ThemeProvider theme={materialTheme}>
      { children }
    </ThemeProvider>
  </MuiPickersUtilsProvider>
);

export default PickersProvider;
