import { useForm } from 'react-hook-form';
import { DateRangePickerComponent } from '@syncfusion/ej2-react-calendars';
import CheckboxButton from 'components/CheckboxButton';
import {
  FEIBTabContext,
  FEIBTabList,
  FEIBTab,
} from 'components/elements';
import { useState } from 'react';
import DepositSearchConditionWrapper from './depositSearchCondition.style';

const DepositSearchCondition = () => {
  const [tabId, setTabId] = useState('0');
  const startValue = new Date('');
  const endValue = new Date('');
  const { register, handleSubmit } = useForm();

  const handleChangeTabList = (event, id) => {
    setTabId(id);
  };

  // eslint-disable-next-line no-unused-vars
  const handleClickSearchButton = async (data) => {
    // TODO: send data
  };

  const renderCalendar = () => (
    <div>
      <DateRangePickerComponent
        cssClass="calendar"
        openOnFocus
        format="yyyy/MM/dd"
        change={(data) => console.log(data)}
        placeholder="請選擇"
        startDate={startValue}
        endDate={endValue}
      />
    </div>
  );

  const renderDate = () => (
    <p>Date</p>
  );

  const renderTabs = () => (
    <div className="tabsArea">
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
    </div>
  );

  return (
    <DepositSearchConditionWrapper>
      { renderTabs() }
      <form onSubmit={handleSubmit(handleClickSearchButton)}>
        <CheckboxButton
          label="繳卡款"
          id="bill"
          register={{ ...register('bill') }}
        />
        <CheckboxButton
          label="轉出"
          id="transfer"
          register={{ ...register('transfer') }}
        />
        <CheckboxButton
          label="付款儲值"
          id="spend"
          register={{ ...register('spend') }}
        />
        <button type="submit">查詢</button>
      </form>
    </DepositSearchConditionWrapper>
  );
};

export default DepositSearchCondition;
