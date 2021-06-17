import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
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
// TODO: 若已選的關鍵字未清空，點擊 search icon 應代入原先已選的關鍵字
const DepositSearchCondition = () => {
  const keywords = useSelector(({ depositInquiry }) => depositInquiry.keywords);
  const dateRange = useSelector(({ depositInquiry }) => depositInquiry.dateRange);
  const [tabId, setTabId] = useState('0');
  const [tempDateRange, setTempDateRange] = useState([]);
  const { register, handleSubmit } = useForm();

  const dispatch = useDispatch();

  const handleClickApplyDateRange = (rangeData) => {
    setTempDateRange(rangeData);
  };

  // 將選擇的關鍵字儲存至 redux
  const saveSelectedKeywords = (keywordData) => {
    const selected = [];
    const selectedKeywords = [];

    // 從 data 中將已選取的關鍵字存放至 selected
    for (let keyword in keywordData) {
      if (keywordData[keyword]) {
        selected.push(keyword);
      }
    }

    // 將 selected 內的關鍵字名稱比對所有關鍵字，得出對應的中文名稱
    selected.forEach((selectedKeyword) => {
      keywords.find((keyword) => {
        if (keyword.name === selectedKeyword) {
          selectedKeywords.push(keyword);
        }
      });
    });

    // 將已選取的關鍵字資料儲存至 redux
    dispatch(setSelectedKeywords(selectedKeywords));
  };

  // 控制 Tabs 頁籤
  const handleChangeTabList = (event, id) => {
    setTabId(id);
  };

  // 點擊查詢按鈕後傳送資料
  const handleClickSearchButton = async (data) => {
    // 關閉底部抽屜
    dispatch(setOpenInquiryDrawer(false));

    // 若有選擇日期，則將日期範圍儲存至 redux
    tempDateRange.length > 0 && dispatch(setDateRange(tempDateRange));

    // 判斷是否有選擇關鍵字，並且將 data (關鍵字) 儲存至 redux
    saveSelectedKeywords(data);

    // TODO: send data
    data.dateRange = tempDateRange;
    // 送資料
  };

  const renderCalendar = () => (
    <div className="calendarArea">
      <FEIBInputLabel>自訂搜尋日期區間</FEIBInputLabel>
      <DateRangePicker date={dateRange} onClick={handleClickApplyDateRange} />
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
