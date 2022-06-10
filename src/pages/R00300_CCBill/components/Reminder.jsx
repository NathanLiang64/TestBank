import { CalendarIcon } from 'assets/images/icons';
import { stringToDate } from 'utilities/Generator';
import ReminderWrapper from './Reminder.style';

const Reminder = ({ bills }) => {
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

  return (
    <ReminderWrapper>
      { bills && (
      <>
        <div className="auto">{ renderReminderText() }</div>
        <CalendarIcon />
      </>
      )}
    </ReminderWrapper>
  );
};

export default Reminder;
