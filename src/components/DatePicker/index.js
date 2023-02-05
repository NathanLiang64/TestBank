/* eslint-disable object-curly-newline */
/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useController } from 'react-hook-form';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { createTheme } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import zhTW from 'date-fns/locale/zh-TW';
import { ThemeProvider } from '@material-ui/styles';
import theme from 'themes/theme';
import FEIBDatePicker from './FEIBDatePicker';

const materialTheme = createTheme({
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

function DatePicker(props) {
  const {
    control, name, minDate, maxDate, defaultValue,
  } = props;
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { invalid, isTouched, isDirty },
    formState: { touchedFields, dirtyFields },
  } = useController({ name, control });

  const [pickDate, setPickDate] = useState(defaultValue ? new Date(defaultValue) : value);

  const handleOnChange = (date, dateStr) => {
    setPickDate(dateStr);
    onChange(date);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={zhTW}>
      <ThemeProvider theme={materialTheme}>
        <FEIBDatePicker
          onBlur={onBlur}
          value={pickDate}
          minDate={minDate}
          maxDate={maxDate}
          onChange={handleOnChange}
        />
      </ThemeProvider>
    </MuiPickersUtilsProvider>
  );
}

export default DatePicker;
