import { useState } from 'react';
import { DateRangePicker as KeyboardDateRangePicker } from 'react-date-range';
import { Button } from '@material-ui/core';
import { EventNoteRounded } from '@material-ui/icons';
import { dateFormatter } from 'utilities/Generator';
import { FEIBInput } from 'components/elements';
import theme from 'themes/theme';
import DateRangePickerWrapper from './dateRangePicker.style';

const DateRangePicker = () => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRangeText, setDateRangeText] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  const selectionRange = {
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    key: 'selection',
  };

  const handleClickInput = () => {
    setShowDatePicker(true);
  };

  const handleClickButton = (data) => {
    setShowDatePicker(false);
    setDateRangeText(`${dateFormatter(data[0])} - ${dateFormatter(data[1])}`);
    console.log(data);
  };

  const handleSelect = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    setDateRange({ startDate, endDate });
  };

  return (
    <DateRangePickerWrapper>
      <FEIBInput
        placeholder="請選擇"
        defaultValue={dateRangeText}
        value={dateRangeText}
          // dateRange.startDate && dateRange.endDate
          //   ? `${dateFormatter(selectionRange.startDate)} - ${dateFormatter(selectionRange.endDate)}`
          //   : ''
        $icon={<EventNoteRounded />}
        $iconFontSize={2.4}
        readOnly
        onClick={handleClickInput}
      />
      {showDatePicker && (
        <div
          className="dateRangePickerMask"
          onClick={() => setShowDatePicker(false)}
        >
          <div
            className="dateRangePickerWrapper"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <KeyboardDateRangePicker
              rangeColors={[theme.colors.primary.light]}
              ranges={[selectionRange]}
              onChange={handleSelect}
              startDatePlaceholder="起始日期"
              endDatePlaceholder="結束日期"
              dateDisplayFormat="yyyy/MM/dd"
            />
            <div className="buttons">
              <Button className="cancel" onClick={() => setShowDatePicker(false)}>取消</Button>
              <Button
                className="apply"
                disabled={!(dateRange.startDate && dateRange.endDate)}
                onClick={() => handleClickButton([dateRange.startDate, dateRange.endDate])}
              >
                確定
              </Button>
            </div>
          </div>
        </div>
      )}
    </DateRangePickerWrapper>
  );
};

export default DateRangePicker;
