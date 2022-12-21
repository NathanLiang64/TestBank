import { useState, useEffect, useReducer } from 'react';
import { useController } from 'react-hook-form';
import { DateRangePicker as KeyboardDateRangePicker } from 'react-date-range';
import { Button } from '@material-ui/core';
import { FEIBInputLabel, FEIBInput } from 'components/elements';
import { dateToString, stringToDate } from 'utilities/Generator';
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
    control, name, label, minDate, maxDate, onChange, value,
  } = props;
  const { field } = control ? useController({ name, control }) : { field: { onChange, value } };
  const myOnChange = field.onChange;
  const myValue = field.value;

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const [showDatePicker, setShowDatePicker] = useState();
  const defaultRange = {
    startDate: (value ? value[0] : null) ?? new Date(),
    endDate: (value ? value[1] : null) ?? new Date(),
    key: 'selection',
  };
  const [model] = useState({
    range: null,
    displayText: null,
    selectionRange: defaultRange,
  });

  useEffect(() => {
    if (myValue?.length) {
      let range = myValue;
      let startDate = myValue[0];
      if (startDate?.constructor === String) { // 為了相容台外幣明細查詢
        if (!startDate) return; // 當沒有設定日期時，維持「自訂搜尋日期區間」為空白。
        startDate = stringToDate(startDate);
        const endDate = stringToDate(myValue[1]) ?? startDate;
        range = [startDate, endDate];
      }
      // eslint-disable-next-line no-use-before-define
      setDateRange(range);
    }
  }, []);

  /**
   *
   * @param {[Date]} range
   */
  const setDateRange = (range) => {
    if (!range) return; // 初始時，會在 range 無值時被觸發！還沒找到原因

    const startDate = range[0];
    const endDate = range[1];
    if (range && range.length === 2 && startDate && endDate) {
      model.range = [startDate, endDate];
      model.displayText = `${dateToString(startDate)} - ${dateToString(endDate)}`;
      model.selectionRange.startDate = startDate;
      model.selectionRange.endDate = endDate;
    } else {
      model.displayText = null;
    }
    forceUpdate();
  };

  const onSelectChanged = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    setDateRange([startDate, endDate]);
  };

  const onCancel = () => {
    setShowDatePicker(false);
    setDateRange(myValue);
    model.selectionRange = defaultRange; // NOTE 必需清除，否則在 value 沒有值時，取消再進來仍會保留原本的設計範圍。
  };

  const onConfirm = () => {
    setShowDatePicker(false);
    myOnChange(model.range);
  };

  // props.value 變更時，同步更新元件的日期區間
  useEffect(() => {
    if (value && value.length === 2 && value[0] && value[1]) setDateRange(value);
  }, [value]);

  return (
    <DateRangePickerWrapper>
      <FEIBInputLabel>{label || '自訂搜尋日期區間'}</FEIBInputLabel>
      <FEIBInput
        placeholder="請選擇"
        value={model?.displayText ?? ''}
        $icon={<CalendarIcon />}
        $iconFontSize={2.4}
        readOnly
        onClick={() => setShowDatePicker(true)}
      />
      {showDatePicker && (
        <div className="dateRangePickerMask">
          <div className="dateRangePickerWrapper" onClick={(event) => { event.stopPropagation(); }}>
            <KeyboardDateRangePicker
              minDate={minDate}
              maxDate={maxDate}
              rangeColors={[theme.colors.primary.light]}
              ranges={[model?.selectionRange]}
              onChange={onSelectChanged}
              startDatePlaceholder="起始日期"
              endDatePlaceholder="結束日期"
              dateDisplayFormat="yyyy/MM/dd"
            />
            <div className="buttons">
              <Button className="cancel" onClick={onCancel}>取消</Button>
              <Button className="apply" disabled={!model?.range} onClick={onConfirm}> 確定 </Button>
            </div>
          </div>
        </div>
      )}
    </DateRangePickerWrapper>
  );
}

export default DateRangePicker;
