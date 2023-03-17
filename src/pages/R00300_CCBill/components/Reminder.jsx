import { CalendarIcon } from 'assets/images/icons';
import { FEIBIconButton } from 'components/elements';
import { showCustomPrompt } from 'utilities/MessageModal';
import { dateToYMD } from 'utilities/Generator';
import ReminderWrapper from './Reminder.style';
import { subscribeCalendar } from '../api';

const Reminder = ({ bills, deductInfo }) => {
  const handleHintText = (text) => {
    if (text.match('提')) {
      const textChanged = text.split('提');
      return [textChanged[0], `提${textChanged[1]}`];
    }
    return [text];
  };

  const downloadICS = () => {
    const title = 'Bankee信用卡繳款截止日';
    const fromDate = dateToYMD(bills.payDueDate);
    subscribeCalendar({title, fromDate});
  };

  const handleCalendarClick = async () => {
    await showCustomPrompt({
      title: '系統訊息',
      message: <p className="txtCenter">將帳單繳款提示加入手機行事曆？</p>,
      okContent: '確認',
      onOk: () => downloadICS(),
      onCancel: () => {},
      showCloseButton: false,
    });
  };

  return (
    <ReminderWrapper>
      { deductInfo && (
      <>
        <div className="auto">{handleHintText(deductInfo.hintToPay).map((text) => (<p key={text}>{text}</p>))}</div>
        <FEIBIconButton $fontSize={2} className="badIcon" onClick={handleCalendarClick}>
          <CalendarIcon />
        </FEIBIconButton>
      </>
      )}
    </ReminderWrapper>
  );
};

export default Reminder;
