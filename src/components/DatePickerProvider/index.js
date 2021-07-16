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
        backgroundColor: theme.colors.primary.light,
        '&:hover': {
          backgroundColor: theme.colors.primary.light,
        },
      },
    },
    MuiButton: {
      textPrimary: {
        color: theme.colors.primary.brand,
        fontSize: '1.4rem',
      },
    },
    MuiTypography: {
      body1: {
        fontSize: '1.4rem',
        color: '#3e484f',
      },
      body2: {
        fontSize: '1.2rem',
      },
      caption: {
        fontSize: '1.4rem',
      },
      subtitle1: {
        fontSize: '1.4rem',
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
