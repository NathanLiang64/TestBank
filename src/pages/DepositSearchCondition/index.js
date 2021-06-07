/* eslint-disable */
import { useSelector, useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { DateRangePickerComponent } from '@syncfusion/ej2-react-calendars';
import CheckboxButton from 'components/CheckboxButton';
import ConfirmButtons from 'components/ConfirmButtons';
import {
  FEIBTabContext, FEIBTabList, FEIBTab, FEIBInputLabel, FEIBInput,
} from 'components/elements';
import { useState } from 'react';
import DepositSearchConditionWrapper from './depositSearchCondition.style';
import { setOpenInquiryDrawer, setDateRange, setSelectedKeywords } from '../DepositInquiry/stores/actions';

const DepositSearchCondition = () => {
  const [tabId, setTabId] = useState('0');
  const keywords = useSelector(({ depositInquiry }) => depositInquiry.keywords);
  const startValue = new Date('');
  const endValue = new Date('');
  const { register, handleSubmit, control } = useForm();

  const dispatch = useDispatch();

  const handleChangeTabList = (event, id) => {
    setTabId(id);
  };

  // eslint-disable-next-line no-unused-vars
  const handleClickSearchButton = async (data) => {
    dispatch(setOpenInquiryDrawer(false));

    // TODO: send data
    const { dateRange } = data;
    console.log(data);

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

    // 從 data 中取得選取的日期範圍
    const startDate = `${dateRange[0].getFullYear()}/${dateRange[0].getMonth() + 1}/${dateRange[0].getDate()}`;
    const endDate = `${dateRange[1].getFullYear()}/${dateRange[1].getMonth() + 1}/${dateRange[1].getDate()}`;
    dispatch(setDateRange(`${startDate} ~ ${endDate}`));
  };

  const renderCalendar = () => (
    <div className="calendarArea">
      <FEIBInputLabel>自訂搜尋日期區間</FEIBInputLabel>
      <Controller
        control={control}
        name="dateRange"
        render={({ field}) => (
          <DateRangePickerComponent
            cssClass="calendar"
            openOnFocus
            format="yyyy/MM/dd"
            // change={(data) => console.log(data)}
            placeholder="請選擇"
            startDate={startValue}
            endDate={endValue}
            { ...field }
          />
        )}
      />
    </div>
  );

  const renderDate = () => (
    <div className="dateArea">
      <p>2021/07/22 ~ 2021/09/22</p>
    </div>
  );

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
