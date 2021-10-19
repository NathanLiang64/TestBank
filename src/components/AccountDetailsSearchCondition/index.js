import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import DateRangePicker from 'components/DateRangePicker';
import CheckboxButton from 'components/CheckboxButton';
import ConfirmButtons from 'components/ConfirmButtons';
import {
  FEIBInput, FEIBInputLabel, FEIBTab, FEIBTabContext, FEIBTabList,
} from 'components/elements';
import { dateFormatter, stringDateCodeFormatter } from 'utilities/Generator';
import AccountDetailsSearchConditionWrapper from './accountDetailsSearchCondition.style';
import {
  setCustomKeyword, setDateRange, setDetailList, setKeywords, setOpenInquiryDrawer, setTempDateRange,
} from '../AccountDetails/stores/actions';

const AccountDetailsSearchCondition = ({
  init, requestConditions, setTabList, setTabId, onSearch,
}) => {
  const keywords = useSelector(({ accountDetails }) => accountDetails.keywords);
  const customKeyword = useSelector(({ accountDetails }) => accountDetails.customKeyword);
  const dateRange = useSelector(({ accountDetails }) => accountDetails.dateRange);
  const tempDateRange = useSelector(({ accountDetails }) => accountDetails.tempDateRange);
  const [autoDateTabId, setAutoDateTabId] = useState('0');
  const { register, unregister, handleSubmit } = useForm();
  const dispatch = useDispatch();

  /* eslint-disable */
  const handleChangeKeywords = (event) => {
    const tempKeywords = Array.from(keywords);
    tempKeywords.find((item) => {
      if (event.target.name === item.name) item.selected = event.target.checked;
    });
    dispatch(setKeywords(tempKeywords));
  };

  // 點擊取消按鈕
  const handleClickCancelButton = () => {
    dispatch(setOpenInquiryDrawer(false));
    init();
  };

  // 點擊查詢按鈕後傳送資料
  const handleClickSearchButton = async (data) => {
    if (data.dateRange) {
      // 若 data.dateRange 屬性，代表使用者送出表單時是由 autoDateArea 區塊自動推斷範圍
      // 而 autoDateArea 區塊的日期範圍因為是 input value 傳進來，所以會是字串格格式，需另外轉成日期格式
      dispatch(setDateRange([new Date(data.dateRange[0]), new Date(data.dateRange[1])]));
      data.dateRange = [
        stringDateCodeFormatter(new Date(data.dateRange[0])),
        stringDateCodeFormatter(new Date(data.dateRange[1])),
      ];
    } else {
      // 若沒有 data.dateRange 屬性，代表沒有選擇日期，或是使用者是由 dateRangePickerArea 區塊的日期選擇器所選擇的
      if (tempDateRange.length) {
        // 若 tempDateRange 有值，代表是由 dateRangePicker 選擇日期
        // 範圍會暫存在 tempDateRange 內，故此處要加入 data.dateRange 後端才收得到
        dispatch(setDateRange(tempDateRange));
        data.dateRange = [stringDateCodeFormatter(tempDateRange[0]), stringDateCodeFormatter(tempDateRange[1])];
      } else {
        // 若 tempDateRange 沒有值，代表沒有選擇日期，預設儲存查詢半年範圍內 (資料庫會判斷)，此處代空字串即可
        data.dateRange = ['', ''];
      }
    }

    // 清空暫時存放的日期範圍
    dispatch(setTempDateRange([]));

    // 關閉底部抽屜
    dispatch(setOpenInquiryDrawer(false));

    // 如果 redux 內的關鍵字有值，送出的關鍵字卻是空的，則關鍵字應代入 redux 內關鍵字的值
    if (customKeyword && (data.keywordCustom === undefined)) data.keywordCustom = customKeyword;
    // 如果 redux 內的關鍵字和送出的關鍵字都是空的，則關鍵字應為空字串值
    if (!customKeyword && !data.keywordCustom) data.keywordCustom = '';
    dispatch(setCustomKeyword(data.keywordCustom));

    // 查詢代入條件：1.帳號, 2.日期起訖範圍, 3.類別, 4.自訂關鍵字
    const { account, tranTP } = requestConditions();
    const beginDT = data.dateRange[0];
    const endDT = data.dateRange[1];
    const custom = data.keywordCustom;


    const conditions = {
      account, beginDT, endDT, tranTP, custom,
    };
    const response = await onSearch(conditions);
    if (response) {
      const { acctDetails, monthly } = response;
      dispatch(setDetailList(acctDetails));
      setTabList(monthly?.length ? monthly.sort((a, b) => b - a) : [])
      setTabId(acctDetails?.length ? acctDetails[0].txnDate.substr(0, 6) : '');
    }
    // getTransactionDetails({
    //   account, beginDT, endDT, tranTP, custom,
    // })
    //   .then((response) => {
    //     const { acctDetails, monthly } = response;
    //     dispatch(setDetailList(acctDetails));
    //     setTabList(monthly?.length ? monthly.sort((a, b) => b - a) : [])
    //     return acctDetails?.length ? acctDetails[0].txnDate.substr(0, 6) : '';
    //   })
    //   .then((tabId) => setTabId(tabId));
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
    switch (autoDateTabId) {
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
        <p>{`${dateFormatter(startDate)} ~ ${dateFormatter(today)}`}</p>
        <input type="text" {...register('dateRange.0')} value={startDate} />
        <input type="text" {...register('dateRange.1')} value={today} />
      </div>
    );
  };

  const renderTabs = () => (
    <FEIBTabContext value={autoDateTabId}>
      <FEIBTabList onChange={(event, id) => setAutoDateTabId(id)} $size="small" $type="fixed">
        <FEIBTab label="自訂" value="0" />
        <FEIBTab label="近六個月" value="1" />
        <FEIBTab label="近一年" value="2" />
        <FEIBTab label="近兩年" value="3" />
        <FEIBTab label="近三年" value="4" />
      </FEIBTabList>
      { autoDateTabId === '0' ? renderDataRangePicker() : renderAutoDate() }
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
    if (dateRange.length > 0) dispatch(setTempDateRange(dateRange));
  }, []);

  return (
    <AccountDetailsSearchConditionWrapper>
      <form onSubmit={handleSubmit(handleClickSearchButton)}>
        { renderTabs() }
        { renderKeywordArea() }
        <ConfirmButtons
          mainButtonValue="查詢"
          subButtonValue="取消"
          subButtonOnClick={handleClickCancelButton}
        />
      </form>
    </AccountDetailsSearchConditionWrapper>
  );
};

export default AccountDetailsSearchCondition;
