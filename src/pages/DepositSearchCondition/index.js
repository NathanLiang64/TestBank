import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
/* eslint-disable */
import { useForm, Controller } from 'react-hook-form';
import { DateRangePickerComponent } from '@syncfusion/ej2-react-calendars';
import DateRangePicker from 'components/DateRangePicker';
import CheckboxButton from 'components/CheckboxButton';
import ConfirmButtons from 'components/ConfirmButtons';
import {
  FEIBTabContext, FEIBTabList, FEIBTab, FEIBInputLabel, FEIBInput,
} from 'components/elements';
import { dateFormatter } from 'utilities/Generator';
import DepositSearchConditionWrapper from './depositSearchCondition.style';
import { setOpenInquiryDrawer, setDateRange, setSelectedKeywords } from '../DepositInquiry/stores/actions';

/* eslint-disable */
const DepositSearchCondition = () => {
  const [tabId, setTabId] = useState('0');
  const keywords = useSelector(({ depositInquiry }) => depositInquiry.keywords);
  const startValue = new Date('');
  const endValue = new Date('');
  const { register, handleSubmit, control } = useForm();

  const dispatch = useDispatch();

  // 將日期範圍儲存至 redux
  const saveDateRange = (dateRangeArray) => {
    const startDate = dateFormatter(new Date(dateRangeArray[0]));
    const endDate = dateFormatter(new Date(dateRangeArray[1]));
    dispatch(setDateRange(`${startDate} ~ ${endDate}`));
  };

  // 控制 Tabs 頁籤
  const handleChangeTabList = (event, id) => {
    setTabId(id);
  };

  // 點擊查詢按鈕後傳送資料
  const handleClickSearchButton = async (data) => {
    const { dateRange, date } = data;

    // 關閉底部抽屜
    dispatch(setOpenInquiryDrawer(false));

    // TODO: send data

    const selectedKeywords = [];
    const selectedKeywordsTitle = [];
    // 從 data 中將已選取的關鍵字存放至 selectedKeywords
    for (let keyword in data) {
      if (data[keyword]) {
        selectedKeywords.push(keyword);
      }
    }
    // 將已選取的關鍵字名稱比對所有關鍵字，得出對應的中文名稱
    selectedKeywords.forEach((selectedKeyword) => {
      keywords.find((keyword) => {
        if (keyword.name === selectedKeyword) {
          selectedKeywordsTitle.push(keyword.title);
        }
      });
    });
    dispatch(setSelectedKeywords(selectedKeywordsTitle));

    // 從 data 中取得日期範圍並將其儲存至 redux
    dateRange ? saveDateRange(dateRange) : saveDateRange(date);
  };

  const renderCalendar = () => (
    <div className="calendarArea">
      <FEIBInputLabel>自訂搜尋日期區間</FEIBInputLabel>
      <DateRangePicker />
      {/*<Controller*/}
      {/*  control={control}*/}
      {/*  name="dateRange"*/}
      {/*  render={({ field}) => (*/}
      {/*    <DateRangePickerComponent*/}
      {/*      cssClass="calendar"*/}
      {/*      openOnFocus*/}
      {/*      start="Year"*/}
      {/*      // depth="Year"*/}
      {/*      format="yyyy/MM/dd"*/}
      {/*      // change={(data) => console.log(data)}*/}
      {/*      placeholder="請選擇"*/}
      {/*      startDate={startValue}*/}
      {/*      endDate={endValue}*/}
      {/*      { ...field }*/}
      {/*    />*/}
      {/*  )}*/}
      {/*/>*/}
    </div>
  );

  const computedStartDate = (date) => {
    switch (tabId) {
      case '1':
        // 計算 6 個月前的日期
        date.setMonth(date.getMonth() - 6);
        return date;
      case '2':
        // 計算 1 年前的日期
        date.setFullYear(date.getFullYear() - 1);
        return date;
      case '3':
        // 計算 2 年前的日期
        date.setFullYear(date.getFullYear() - 2);
        return date;
      case '4':
        // 計算 3 年前的日期
        date.setFullYear(date.getFullYear() - 3);
        return date;
    }
  };

  const renderDate = () => {
    const today = new Date();
    let startDate = computedStartDate(new Date());

    return (
      <div className="dateArea">
        <p>{ dateFormatter(startDate) } ~ { dateFormatter(today) }</p>
        <input type="text" { ...register('date.0') } value={startDate} />
        <input type="text" { ...register('date.1') } value={today} />
      </div>
    );
  };

  const renderTabs = () => (
    <FEIBTabContext value={tabId}>
      <FEIBTabList onChange={handleChangeTabList} $size="small" $type="fixed">
        <FEIBTab label="自訂" value="0" />
        <FEIBTab label="近六個月" value="1" />
        <FEIBTab label="近一年" value="2" />
        <FEIBTab label="近兩年" value="3" />
        <FEIBTab label="近三年" value="4" />
      </FEIBTabList>
      { tabId === '0' ? renderCalendar() : renderDate() }
    </FEIBTabContext>
  );

  const renderKeywordArea = () => (
    <div className="keywordArea">
      <FEIBInputLabel>加入關鍵字，更快搜尋到您要的明細！</FEIBInputLabel>
      <div className="defaultKeywords">
        {
          keywords.map((keyword) => (
            <CheckboxButton
              key={keyword.name}
              label={keyword.title}
              register={{ ...register(keyword.name) }}
            />
          ))
        }
      </div>
      <div className="customKeywords">
        <FEIBInputLabel>自訂關鍵字</FEIBInputLabel>
        <FEIBInput
          name="keywordCustom"
          placeholder="請輸入，最多可輸入16個字元"
          {...register('keywordCustom', { maxLength: 16 })}
        />
      </div>
    </div>
  );

  return (
    <DepositSearchConditionWrapper>
      <form onSubmit={handleSubmit(handleClickSearchButton)}>
        { renderTabs() }
        { renderKeywordArea() }
        <ConfirmButtons
          mainButtonValue="查詢"
          subButtonValue="取消"
          subButtonOnClick={() => dispatch(setOpenInquiryDrawer(false))}
        />
      </form>
    </DepositSearchConditionWrapper>
  );
};

export default DepositSearchCondition;
