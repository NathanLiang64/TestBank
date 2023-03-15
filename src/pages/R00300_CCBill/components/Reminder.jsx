import { CalendarIcon } from 'assets/images/icons';
import { FEIBIconButton } from 'components/elements';
import { showCustomPrompt } from 'utilities/MessageModal';
import { dateToYMD } from 'utilities/Generator';
import { getOsType } from 'utilities/AppScriptProxy';
import ReminderWrapper from './Reminder.style';
import { downloadCalendar } from '../api';

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

    const osType = getOsType(true); // 1.iOS, 2.Android,
    if (osType === 1) { // iOS 平台
      downloadCalendar({title, fromDate});
    } else { // Android 或其他平台
      const googleCalendarUrl = 'https://www.google.com/calendar/render?';
      const action = 'TEMPLATE';
      const fromEndDate = `${fromDate}/${fromDate}`;
      window.open(`${googleCalendarUrl}action=${action}&text=${title}&dates=${fromEndDate}`, '_blank');
    }
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
