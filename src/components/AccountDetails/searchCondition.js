/* eslint-disable object-curly-newline */
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import DateRangePicker from 'components/DateRangePicker';
import CheckboxButton from 'components/CheckboxButton';
import ConfirmButtons from 'components/ConfirmButtons';
import {
  FEIBInput, FEIBInputLabel, FEIBTab, FEIBTabContext, FEIBTabList,
} from 'components/elements';
import { stringDateCodeFormatter, stringToDate, stringDateFormatter } from 'utilities/Generator';
import SearchConditionWrapper from './searchCondition.style';

const SearchCondition = ({
  condition, onSearch, onCancel,
}) => {
  const [newCondition, setNewCondition] = useState(condition);
  const [autoDateTabId, setAutoDateTabId] = useState('0');

  const defaultKeywords = [
    { id: 1, title: '跨轉' },
    { id: 2, title: 'ATM' },
    { id: 3, title: '存款息' },
    { id: 4, title: '薪轉' },
    { id: 5, title: '付款儲存' },
    { id: 6, title: '自動扣繳' },
  ];

  const { register, handleSubmit } = useForm();

  // 點擊查詢按鈕後傳送資料
  const handleClickSearchButton = async (data) => {
    if (data.customKeyword) {
      onSearch({
        ...newCondition,
        custom: data.customKeyword,
      });
    } else {
      onSearch(newCondition);
    }
  };

  const renderDataRangePicker = () => {
    const handleClickDateRangePicker = (range) => {
      setNewCondition({
        ...newCondition,
        startDate: stringDateCodeFormatter(range[0]), // 轉為 YYYYMMDD
        endDate: stringDateCodeFormatter(range[1]),
      });
    };
    const dateRange = [
      stringToDate(newCondition?.startDate), // DateRangePicker 需要 Date 型別。
      stringToDate(newCondition?.endDate),
    ];

    return (
      <div className="dateRangePickerArea">
        <DateRangePicker date={dateRange} onClick={handleClickDateRangePicker} />
      </div>
    );
  };

  const computedStartDate = (mode) => {
    const date = new Date();
    // eslint-disable-next-line default-case
    switch (mode) {
      case '1':
        // 計算 6 個月前的日期
        date.setMonth(date.getMonth() - 6);
        break;
      case '2':
        // 計算 1 年前的日期
        date.setFullYear(date.getFullYear() - 1);
        break;
      case '3':
        // 計算 2 年前的日期
        date.setFullYear(date.getFullYear() - 2);
        break;
      case '4':
        // 計算 3 年前的日期
        date.setFullYear(date.getFullYear() - 3);
    }
    return date;
  };

  useEffect(() => {
    if (autoDateTabId === '0') return;
    const today = new Date();
    const startDate = computedStartDate(autoDateTabId);
    setNewCondition({
      ...newCondition,
      startDate: stringDateCodeFormatter(startDate), // 轉為 YYYYMMDD
      endDate: stringDateCodeFormatter(today),
    });
  }, [autoDateTabId]);

  const renderTabs = () => (
    <FEIBTabContext value={autoDateTabId}>
      <FEIBTabList onChange={(event, id) => setAutoDateTabId(id)} $size="small" $type="fixed">
        <FEIBTab label="自訂" value="0" />
        <FEIBTab label="近六個月" value="1" />
        <FEIBTab label="近一年" value="2" />
        <FEIBTab label="近兩年" value="3" />
        <FEIBTab label="近三年" value="4" />
      </FEIBTabList>
      { autoDateTabId === '0' ? renderDataRangePicker() : (
        <div className="autoDateArea">
          <p>{`${stringDateFormatter(newCondition?.startDate)} ~ ${stringDateFormatter(newCondition?.endDate)}`}</p>
        </div>
      ) }
    </FEIBTabContext>
  );

  /**
   * 顯示 預設查詢關鍵字清單。
   * @param {*} items 預設的查詢關鍵字清單。
   */
  const renderKeywordArea = (items) => {
    // 使用者變更關鍵字的選取狀態。
    const handleKeywordSelectChanged = (event) => {
      const keyId = event.target.id;
      const selectedItems = newCondition?.txnType?.split(',') ?? [];
      if (event.target.checked) selectedItems.push(keyId);
      else {
        const index = selectedItems.indexOf(keyId);
        selectedItems.splice(index, 1);
      }
      setNewCondition({
        ...newCondition,
        txnType: selectedItems.join(','), // 重建預設查詢關鍵字代碼清單。 TODO：確認要不要加','
      });
    };
    // 檢查目前的關鍵字是否已被使用者選取。
    const isSelected = (keyId) => {
      if (!newCondition?.txnType) return false;
      const selectedItems = newCondition.txnType.split(',');
      return selectedItems.indexOf(keyId.toString()) >= 0;
    };
    // 傳回 UI 元素
    return (
      <div className="keywordArea">
        <FEIBInputLabel>加入關鍵字，更快搜尋到您要的明細！</FEIBInputLabel>
        <div className="defaultKeywords">
          { items.map((keyword) => (
            <CheckboxButton
              id={keyword.id}
              key={keyword.id}
              label={keyword.title}
              checked={isSelected(keyword.id)}
              onChange={handleKeywordSelectChanged}
            />
          )) }
        </div>
        <div className="customKeywords">
          <FEIBInputLabel>自訂關鍵字</FEIBInputLabel>
          <FEIBInput
            name="customKeyword"
            placeholder="請輸入，最多可輸入16個字元"
            defaultValue={newCondition?.custom}
            {...register('customKeyword', { maxLength: 16 })}
          />
        </div>
      </div>
    );
  };

  return (
    <SearchConditionWrapper>
      <form onSubmit={handleSubmit(handleClickSearchButton)}>
        { renderTabs() }
        { renderKeywordArea(defaultKeywords) }
        <ConfirmButtons
          mainButtonValue="查詢"
          subButtonValue="取消"
          subButtonOnClick={onCancel}
        />
      </form>
    </SearchConditionWrapper>
  );
};

export default SearchCondition;
