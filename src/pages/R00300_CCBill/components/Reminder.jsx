import { useDispatch } from 'react-redux';
import uuid from 'react-uuid';
import { CalendarIcon } from 'assets/images/icons';
import { stringToDate } from 'utilities/Generator';
import { setModal, setModalVisible } from 'stores/reducers/ModalReducer';
import { FEIBIconButton } from 'components/elements';
import ReminderWrapper from './Reminder.style';

const Reminder = ({ bills }) => {
  const dispatch = useDispatch();

  const renderReminderText = () => {
    const due = stringToDate(bills.billDate);
    const today = new Date();
    const dueDateString = `每月${due.getDate()}日`;
    const deltaDays = Math.ceil(Math.abs(due - today) / (1000 * 60 * 60 * 24));

    // 逾截止日
    if (today > due) return bills.autoDeduct ? `${dueDateString}自動扣繳` : `繳款截止日：${dueDateString}`;

    // 10天以上
    if (deltaDays >= 10) return bills.autoDeduct ? `自動扣繳（${dueDateString}）尚有${deltaDays}天` : `繳款截止日（${dueDateString}）尚有${deltaDays}天`;

    // 1-9天
    return bills.autoDeduct ? (
      <>
        {`自動扣繳（${dueDateString}）尚有${deltaDays}天`}
        <br />
        提醒您確認帳戶餘額！
      </>
    ) : (
      <>
        {`繳款截止日（${dueDateString}）尚有${deltaDays}天`}
        <br />
        提醒您於截止日前繳款
      </>
    );
  };

  const downloadICS = () => {
    const context = [
      'BEGIN:VCALENDAR',
      'PRODID:-//FEIB//Bankee credit card reminder//TW',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `UID:${uuid()}`,
      `DTSTAMP:${new Date().toISOString().replaceAll('-', '').replaceAll(':', '')
        .split('.')[0]}Z`,
      `DTSTART;VALUE=DATE:${bills.billDate}`,
      'RRULE:FREQ=MONTHLY',
      'SUMMARY:Bankee信用卡繳款截止日',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([context], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', '提醒繳款.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCalendarClick = () => {
    dispatch(setModal({
      title: '系統訊息', content: '將帳單繳款提示加入手機行事曆？', okContent: '確認', onOk: () => downloadICS(),
    }));
    dispatch(setModalVisible(true));
  };

  return (
    <ReminderWrapper>
      { bills && (
      <>
        <div className="auto">{ renderReminderText() }</div>
        <FEIBIconButton className="badIcon" onClick={handleCalendarClick}>
          <CalendarIcon />
        </FEIBIconButton>
      </>
      )}
    </ReminderWrapper>
  );
};

export default Reminder;
