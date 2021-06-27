/* eslint-disable */
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
import {
  setOpenInquiryDrawer,
  setDateRange,
  setKeywords,
  setCustomKeyword,
  setDisplayKeywords,
} from '../DepositInquiry/stores/actions';

// TODO: 若已選的關鍵字未清空，點擊 search icon 應代入原先已選的關鍵字
const DepositSearchCondition = ({ initKeywords }) => {
  const keywords = useSelector(({ depositInquiry }) => depositInquiry.keywords);
  const customKeyword = useSelector(({ depositInquiry }) => depositInquiry.customKeyword);
  const dateRange = useSelector(({ depositInquiry }) => depositInquiry.dateRange);
  const [tabId, setTabId] = useState('0');
  const [tempDateRange, setTempDateRange] = useState([]);
  const { register, handleSubmit } = useForm();

  const dispatch = useDispatch();

  const handleClickApplyDateRange = (rangeData) => {
    setTempDateRange(rangeData);
  };

  // 控制 Tabs 頁籤
  const handleChangeTabList = (event, id) => {
    setTabId(id);
  };

  const handleChangeKeywords = (event) => {
    const tempKeywords = Array.from(keywords);
    tempKeywords.find((item) => {
      if (event.target.name === item.name) {
        item.selected = event.target.checked;
      }
    });
    dispatch(setKeywords(tempKeywords));
  };

  const handleClickCancelButton = () => {
    dispatch(setOpenInquiryDrawer(false));
    // 清空查詢條件
    dispatch(setDateRange([]));
    dispatch(setCustomKeyword(''));
    dispatch(setKeywords(initKeywords));
  };

  // 點擊查詢按鈕後傳送資料
  const handleClickSearchButton = async (data) => {
    const { keywordCustom } = data;
    // 關閉底部抽屜
    dispatch(setOpenInquiryDrawer(false));

    // 若有選擇日期，則將日期範圍儲存至 redux
    if (tempDateRange.length > 0) {
      dispatch(setDateRange(tempDateRange));
    } else {
      // 若無選擇日期，預設儲存三年範圍
      const today = new Date();
      const threeYearsAgo = new Date();
      threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
      dispatch(setDateRange([threeYearsAgo, today]));
    }

    // 拷貝一份當前的 keywords 陣列
    const tempKeywordsString = JSON.stringify(keywords);
    const tempKeywords = JSON.parse(tempKeywordsString);

    // 將自訂關鍵字添加至 tempKeywords 陣列
    tempKeywords.push({
      title: keywordCustom || '無自訂關鍵字',
      name: 'keywordCustom',
      selected: keywordCustom.length > 0,
    });
    // 將自訂關鍵字內容存至 redux
    dispatch(setCustomKeyword(keywordCustom));

    // 若未選取任何關鍵字，則 dispatch 空陣列至 displayKeywords，有選擇則 dispatch 拷貝後的 keywords 陣列
    const nonSelected = tempKeywords.every((item) => item.selected === false);
    nonSelected ? dispatch(setDisplayKeywords([])) : dispatch(setDisplayKeywords(tempKeywords));

    // TODO: send data
    data.dateRange = tempDateRange;
    // 送資料
  };

  const renderCalendar = () => (
    <div className="calendarArea">
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
              onChange={handleChangeKeywords}
              checked={keyword.selected}
            />
          ))
        }
      </div>
      <div className="customKeywords">
        <FEIBInputLabel>自訂關鍵字</FEIBInputLabel>
        <FEIBInput
          name="keywordCustom"
          placeholder="請輸入，最多可輸入16個字元"
          defaultValue={customKeyword}
          autoFocus
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
          subButtonOnClick={handleClickCancelButton}
        />
      </form>
    </DepositSearchConditionWrapper>
  );
};

export default DepositSearchCondition;
