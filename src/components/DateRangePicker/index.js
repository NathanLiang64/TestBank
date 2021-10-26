import { useState, useEffect } from 'react';
import { DateRangePicker as KeyboardDateRangePicker } from 'react-date-range';
import { Button } from '@material-ui/core';
import { FEIBInputLabel, FEIBInput } from 'components/elements';
import { dateFormatter } from 'utilities/Generator';
import { CalendarIcon } from 'assets/images/icons';
import theme from 'themes/theme';
import DateRangePickerWrapper from './dateRangePicker.style';

/*
* ==================== DateRangePicker 組件說明 ====================
* 時間範圍選擇輸入框
* ==================== DateRangePicker 可傳參數 ====================
* 1. label -> label 標題文字，若不傳預設為 "自訂搜尋日期區間"
* 2. date -> 時間範圍，型別為陣列
*    陣列內第一個值為起始日，第二個值為結束日 -> date = [startDate, endDate]
*    若有需動態保留的時間範圍可代入，若無則預設為當日
* 3. onClick -> 點擊事件
*    日期範圍選擇完畢後，點擊面板右下方 "確定" 後所觸發的事件，可直接在外部傳入一個 function
*    該 function 可以接收一個任意參數，透過該參數將可取得所選的日期範圍
* */

const DateRangePicker = ({
  label, date, onClick, minDate, maxDate,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRangeText, setDateRangeText] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: date[0] || new Date(),
    endDate: date[1] || new Date(),
  });

  const selectionRange = {
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    key: 'selection',
  };

  // 將 dateRange 由 array 轉為 string 並儲存
  const setDateRangeToString = (rangeArray) => {
    setDateRangeText(`${dateFormatter(rangeArray[0])} - ${dateFormatter(rangeArray[1])}`);
  };

  const handleClickApplyButton = (data) => {
    setShowDatePicker(false);
    setDateRangeToString(data);
    onClick(data);
  };

  const handleSelect = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    setDateRange({ startDate, endDate });
  };

  useEffect(() => {
    if (date.length > 0) {
      setDateRangeToString(date);
    }
  }, [date]);

  return (
    <DateRangePickerWrapper>
      <FEIBInputLabel>{label || '自訂搜尋日期區間'}</FEIBInputLabel>
      <FEIBInput
        placeholder="請選擇"
        value={dateRangeText}
        $icon={<CalendarIcon />}
        $iconFontSize={2.4}
        readOnly
        onClick={() => setShowDatePicker(true)}
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
              minDate={minDate}
              maxDate={maxDate}
            />
            <div className="buttons">
              <Button className="cancel" onClick={() => setShowDatePicker(false)}>取消</Button>
              <Button
                className="apply"
                disabled={!(dateRange.startDate && dateRange.endDate)}
                onClick={() => handleClickApplyButton([dateRange.startDate, dateRange.endDate])}
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
