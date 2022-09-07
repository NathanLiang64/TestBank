/* eslint-disable object-curly-newline */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useController } from 'react-hook-form';
import { DateRangePicker as KeyboardDateRangePicker } from 'react-date-range';
import { Button } from '@material-ui/core';
import { FEIBInputLabel, FEIBInput } from 'components/elements';
import { dateFormatter, stringToDate } from 'utilities/Generator';
import { CalendarIcon } from 'assets/images/icons';
import theme from 'themes/theme';
import DateRangePickerWrapper from './dateRangePicker.style';

/*
* ==================== DateRangePicker 組件說明 ====================
* 時間範圍選擇輸入框
* ==================== DateRangePicker 可傳參數 ====================
* 1. label -> label 標題文字，若不傳預設為 "自訂搜尋日期區間"
* 2. value -> 時間範圍，型別為陣列
*    陣列內第一個值為起始日，第二個值為結束日 -> date = [startDate, endDate]
*    若有需動態保留的時間範圍可代入，若無則預設為當日
* 3. onChange -> 點擊事件
*    日期範圍選擇完畢後，點擊面板右下方 "確定" 後所觸發的事件，可直接在外部傳入一個 function
*    該 function 可以接收一個任意參數，透過該參數將可取得所選的日期範圍
* */
function DateRangePicker(props) {
  const {
    control, name, label, minDate, defaultValue,
  } = props;
  console.log(props);
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { invalid, isTouched, isDirty },
    formState: { touchedFields, dirtyFields },
  } = useController({ name, control, defaultValue });

  const [showDatePicker, setShowDatePicker] = useState();
  const [displayText, setDisplayText] = useState();
  const [dateRange, setDateRange] = useState();
  const defaultRange = {
    startDate: minDate,
    endDate: minDate,
    key: 'selection',
  };
  const [selectionRange, setSelectionRange] = useState(defaultRange);

  useEffect(() => {
    if (value?.length) {
      let range = value;
      let startDate = value[0];
      if (typeof startDate === 'string') { // 為了相容台外幣明細
        if (!startDate) return; // 當沒有設定日期時，維持「自訂搜尋日期區間」為空白。
        startDate = stringToDate(startDate);
        const endDate = stringToDate(value[1]) ?? startDate;
        range = [startDate, endDate];
      }
      setDateRange(range);
    }
  }, []);

  useEffect(() => {
    if (dateRange) {
      setDisplayText(`${dateFormatter(dateRange[0])} - ${dateFormatter(dateRange[1])}`);
      setSelectionRange({
        ...selectionRange,
        startDate: dateRange[0],
        endDate: dateRange[1],
      });
    } else {
      setDisplayText(null);
    }
  }, [dateRange]);

  const onSelectChanged = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    setDateRange([startDate, endDate]);
  };

  const onCancel = () => {
    setShowDatePicker(false);
    setDateRange(value);
    setSelectionRange(defaultRange); // NOTE 必需清除，否則在 value 沒有值時，取消再進來仍會保留原本的設計範圍。
  };

  const onConfirm = () => {
    setShowDatePicker(false);
    onChange(dateRange);
  };

  return (
    <DateRangePickerWrapper>
      <FEIBInputLabel>{label || '自訂搜尋日期區間'}</FEIBInputLabel>
      <FEIBInput
        placeholder="請選擇"
        value={displayText ?? ''}
        $icon={<CalendarIcon />}
        $iconFontSize={2.4}
        readOnly
        onClick={() => setShowDatePicker(true)}
      />
      {showDatePicker && (
        <div className="dateRangePickerMask">
          <div className="dateRangePickerWrapper" onClick={(event) => { event.stopPropagation(); }}>
            <KeyboardDateRangePicker
              rangeColors={[theme.colors.primary.light]}
              ranges={[selectionRange]}
              onChange={onSelectChanged}
              startDatePlaceholder="起始日期"
              endDatePlaceholder="結束日期"
              dateDisplayFormat="yyyy/MM/dd"
            />
            <div className="buttons">
              <Button className="cancel" onClick={onCancel}>取消</Button>
              <Button className="apply" disabled={!dateRange} onClick={onConfirm}> 確定 </Button>
            </div>
          </div>
        </div>
      )}
    </DateRangePickerWrapper>
  );
}

export default DateRangePicker;
