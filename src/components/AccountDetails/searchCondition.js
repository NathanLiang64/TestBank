import { useState, useReducer } from 'react';
import { useForm } from 'react-hook-form';
import DateRangePicker from 'components/DateRangePicker';
import CheckboxButton from 'components/CheckboxButton';
import ConfirmButtons from 'components/ConfirmButtons';
import {
  FEIBInput, FEIBInputLabel, FEIBTab, FEIBTabContext, FEIBTabList,
} from 'components/elements';
import { dateToString, stringToDate } from 'utilities/Generator';
import SearchConditionWrapper from './searchCondition.style';

const SearchCondition = ({
  condition, onSearch, onCancel,
}) => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const [newCondition] = useState({...condition});
  const datePickerLimit = { // 用來限制設定選擇日期時的範圍。
    minDate: new Date(new Date().setFullYear(new Date().getFullYear() - 3)), // 三年內。
    maxDate: new Date(),
  };

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
    newCondition.custom = data.customKeyword;
    onSearch(newCondition);
  };

  const handleClickDateRangePicker = (range) => {
    newCondition.startDate = dateToString(range[0], ''); // 轉為 YYYYMMDD
    newCondition.endDate = dateToString(dateToString(range[1], ''));
  };

  const renderTabs = () => {
    let startDate;
    let endDate;
    if (!newCondition.mode) newCondition.mode = '0';
    if (newCondition.mode === '0') {
      startDate = stringToDate(newCondition?.startDate); // 轉為 Date 型別。
      endDate = stringToDate(newCondition?.endDate);
    } else {
      endDate = new Date();
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - [6, 12, 24, 36][newCondition.mode - '1']);
    }

    const setAutoDateTabId = (mode) => {
      newCondition.mode = mode;
      forceUpdate();
    };

    return (
      // TODO 存款明細查詢-限三年內、存錢計劃-限計劃起始當日（而且還要精確到時間）
      <FEIBTabContext value={newCondition.mode}>
        <FEIBTabList onChange={(event, id) => setAutoDateTabId(id)} $size="small" $type="fixed">
          <FEIBTab label="自訂" value="0" />
          <FEIBTab label="近六個月" value="1" />
          <FEIBTab label="近一年" value="2" />
          <FEIBTab label="近兩年" value="3" />
          <FEIBTab label="近三年" value="4" />
        </FEIBTabList>
        { newCondition.mode === '0' ? (
          <div className="dateRangePickerArea">
            <DateRangePicker
              {...datePickerLimit}
              value={[startDate, endDate]} // DateRangePicker 需要 Date 型別。
              onChange={handleClickDateRangePicker}
            />
          </div>
        ) : (
          <div className="autoDateArea">
            <p>{`${dateToString(startDate)} ~ ${dateToString(endDate)}`}</p>
          </div>
        ) }
      </FEIBTabContext>
    );
  };

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
      newCondition.txnType = selectedItems.length ? selectedItems.join(',') : null; // 重建預設查詢關鍵字代碼清單。
      forceUpdate();
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
