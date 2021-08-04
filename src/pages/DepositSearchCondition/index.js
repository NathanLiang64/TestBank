/* eslint-disable */
import { useState, useEffect } from 'react';
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
  setTempDateRange,
  setKeywords,
  setCustomKeyword,
} from '../DepositInquiry/stores/actions';

const DepositSearchCondition = ({ initKeywords }) => {
  const keywords = useSelector(({ depositInquiry }) => depositInquiry.keywords);
  const customKeyword = useSelector(({ depositInquiry }) => depositInquiry.customKeyword);
  const dateRange = useSelector(({ depositInquiry }) => depositInquiry.dateRange);
  const tempDateRange = useSelector(({ depositInquiry }) => depositInquiry.tempDateRange);
  const [tabId, setTabId] = useState('0');
  const { register, unregister, handleSubmit } = useForm();
  const dispatch = useDispatch();

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
    dispatch(setTempDateRange([]));
    dispatch(setCustomKeyword(''));
    dispatch(setKeywords(initKeywords));
  };

  // 點擊查詢按鈕後傳送資料
  const handleClickSearchButton = async (data) => {
    if (data.dateRange) {
      // 若 data.dateRange 屬性，代表使用者送出表單時是由 autoDateArea 區塊自動推斷範圍
      // 而 autoDateArea 區塊的日期範圍因為是 input value 傳進來，所以會是字串格格式，需另外轉成日期格式
      dispatch(setDateRange([new Date(data.dateRange[0]), new Date(data.dateRange[1])]));
    } else {
      // 若沒有 data.dateRange 屬性，代表沒有選擇日期，或是使用者是由 dateRangePickerArea 區塊的日期選擇器所選擇的
      if (tempDateRange.length) {
        // 若 tempDateRange 有值，代表是由 dateRangePicker 選擇日期
        // 範圍會暫存在 tempDateRange 內，故此處要加入 data.dateRange 後端才收得到
        dispatch(setDateRange(tempDateRange));
        data.dateRange = tempDateRange;
      } else {
        // 若 tempDateRange 沒有值，代表沒有選擇日期，預設儲存三年範圍，此處要加入 data.dateRange 後端才收得到
        const today = new Date();
        const threeYearsAgo = new Date();
        threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
        dispatch(setDateRange([threeYearsAgo, today]));
        data.dateRange = [threeYearsAgo, today];
      }
    }

    // 清空暫時存放的日期範圍
    dispatch(setTempDateRange([]));

    // 關閉底部抽屜
    dispatch(setOpenInquiryDrawer(false));

    if (customKeyword) {
      if (data.keywordCustom === undefined) {
        data.keywordCustom = customKeyword;
      }
    } else {
      if (!data.keywordCustom) {
        data.keywordCustom = '';
      }
    }
    dispatch(setCustomKeyword(data.keywordCustom));

    // 送資料
  };

  const handleClickDateRangePicker = (range) => {
    dispatch(setTempDateRange(range));
    // 一旦使用改變自訂日期範圍，就取消 autoDateArea 的 input 註冊，避免兩邊重複取值
    unregister('dateRange');
  };

  const renderDataRangePicker = () => (
    <div className="dateRangePickerArea">
      <DateRangePicker date={dateRange} onClick={handleClickDateRangePicker} />
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

  const renderAutoDate = () => {
    const today = new Date();
    const startDate = computedStartDate(new Date());

    return (
      <div className="autoDateArea">
        <p>{ dateFormatter(startDate) } ~ { dateFormatter(today) }</p>
        <input type="text" { ...register('dateRange.0') } value={startDate} />
        <input type="text" { ...register('dateRange.1') } value={today} />
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
      { tabId === '0' ? renderDataRangePicker() : renderAutoDate() }
    </FEIBTabContext>
  );

  const renderKeywordArea = () => (
    <div className="keywordArea">
      <FEIBInputLabel>加入關鍵字，更快搜尋到您要的明細！</FEIBInputLabel>
      <div className="defaultKeywords">
        { keywords.map((keyword) => (
          <CheckboxButton
            key={keyword.name}
            label={keyword.title}
            register={{ ...register(keyword.name) }}
            onChange={handleChangeKeywords}
            checked={keyword.selected}
          />
        )) }
      </div>
      <div className="customKeywords">
        <FEIBInputLabel>自訂關鍵字</FEIBInputLabel>
        <FEIBInput
          name="keywordCustom"
          placeholder="請輸入，最多可輸入16個字元"
          defaultValue={customKeyword}
          {...register('keywordCustom', { maxLength: 16 })}
        />
      </div>
    </div>
  );

  useEffect(() => {
    // 如果 dateRange 有值，表示上一次查詢紀錄有日期，重新開啟搜尋面板時需自動代入
    if (dateRange.length > 0) {
      dispatch(setTempDateRange(dateRange));
    }
  }, []);

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
