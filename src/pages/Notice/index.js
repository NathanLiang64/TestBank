import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';

/* Elements */
import {
  FEIBTabContext,
  FEIBTabList,
  FEIBTab,
  FEIBTabPanel,
  FEIBBorderButton,
} from 'components/elements';
// import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import ConfirmButtons from 'components/ConfirmButtons';
import Dialog from 'components/Dialog';

/* Styles */
import theme from 'themes/theme';
import NoticeWrapper from './notice.style';

const Notice = () => {
  const history = useHistory();
  const [dummyNoticeList, setDummyNotcieList] = useState([
    {
      type: 0,
      noticeID: 1,
      readed: false,
      content: '您於05/12 15:00 進行信用卡消費，卡號末4碼5566，消費金額3900元，謹慎理財信用至上',
      date: '2021/05/12 15:00',
    },
    {
      type: 0,
      noticeID: 2,
      readed: true,
      content: '您於05/12 15:00 進行信用卡消費，卡號末4碼5566，消費金額3900元',
      date: '2021/05/12 15:00',
    },
    {
      type: 1,
      noticeID: 1,
      readed: true,
      content: '最新優惠 xxxx',
      date: '2021/05/12 15:00',
    },
    {
      type: 1,
      noticeID: 2,
      readed: false,
      content: '最新優惠 yyyy',
      date: '2021/05/12 15:00',
    },
    {
      type: 2,
      noticeID: 1,
      readed: true,
      content: '您於05/12 15:00 進行收款，帳號末4碼3333，收款金額300元',
      date: '2021/05/12 15:00',
    },
    {
      type: 2,
      noticeID: 2,
      readed: false,
      content: '您於05/12 15:00 進行轉帳，帳號末4碼6666，轉帳金額900元',
      date: '2021/05/12 15:00',
    },
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState('是否將通知關閉');
  const [handleClickMainButton, setHandleClickMainButton] = useState(() => () => {});
  const [value, setValue] = useState('0');
  const [personalAccountNotice, setPersonalAccountNotice] = useState([
    {
      type: 0,
      noticeID: 1,
      readed: false,
      content: '',
      date: '',
    },
  ]);
  const [socialPromoNotice, setSocialPromoNotice] = useState([
    {
      type: 0,
      noticeID: 1,
      readed: false,
      content: '',
      date: '',
    },
  ]);
  const [socialAccountNotice, setSocialAccountNotice] = useState([
    {
      type: 0,
      noticeID: 1,
      readed: false,
      content: '',
      date: '',
    },
  ]);

  const getNoticeListByType = (type) => {
    if (type === '0') {
      const data = dummyNoticeList.filter((notice) => notice.type === Number(type));
      setPersonalAccountNotice(data);
    }
    if (type === '1') {
      const data = dummyNoticeList.filter((notice) => notice.type === Number(type));
      setSocialPromoNotice(data);
    }
    if (type === '2') {
      const data = dummyNoticeList.filter((notice) => notice.type === Number(type));
      setSocialAccountNotice(data);
    }
  };

  const handleToggleDialog = (bool) => {
    setOpenDialog(bool);
  };

  const handleTabChange = (event, type) => {
    setValue(type);
    getNoticeListByType(type);
  };

  const readAllNotice = () => {
    const newNoticeList = dummyNoticeList.map((data) => {
      const noticeItem = data;
      if (noticeItem.type === Number(value)) {
        noticeItem.readed = true;
      }
      return noticeItem;
    });
    setDummyNotcieList(newNoticeList);
  };

  const deleteAllNotice = () => {
    const newNoticeList = dummyNoticeList.filter((data) => data.type !== Number(value));
    setDummyNotcieList(newNoticeList);
  };

  const handleRead = () => {
    setDialogContent('是否確認將訊息皆設定為已讀？');
    setHandleClickMainButton(() => () => readAllNotice());
    setOpenDialog(true);
  };

  const handleDelete = () => {
    setDialogContent('是否確認將訊息皆設定為刪除？');
    setHandleClickMainButton(() => () => deleteAllNotice());
    setOpenDialog(true);
  };

  const toNoticeContentPage = (data) => {
    history.push('/notice1', { data });
  };

  const renderNoticeList = (data) => (
    <button type="button" key={data.noticeID} className="noticeCard" onClick={() => toNoticeContentPage(data)}>
      <div className="alertIcon">
        <FiberManualRecordIcon style={{ fontSize: '1rem', opacity: data.readed ? '0' : '1' }} />
      </div>
      <div className="right">
        <div className="content">{data.content}</div>
        <div className="date">{data.date}</div>
      </div>
    </button>
  );

  useCheckLocation();
  usePageInfo('/api/notice');

  useEffect(() => {
    getNoticeListByType('0');
    getNoticeListByType('1');
    getNoticeListByType('2');
  }, [dummyNoticeList]);

  return (
    <NoticeWrapper small>
      <FEIBTabContext value={value}>
        <FEIBTabList onChange={handleTabChange}>
          <FEIBTab label="個人帳務" value="0" />
          <FEIBTab label="社群/優惠" value="1" />
          <FEIBTab label="社群帳本" value="2" />
        </FEIBTabList>
        <div className="button-container">
          <FEIBBorderButton onClick={handleRead}>全部已讀</FEIBBorderButton>
          <FEIBBorderButton $borderColor={theme.colors.background.point} $color={theme.colors.text.point} onClick={handleDelete}>全部刪除</FEIBBorderButton>
        </div>
        <FEIBTabPanel value="0">
          {
            personalAccountNotice.map((notice) => (
              renderNoticeList(notice)
            ))
          }
        </FEIBTabPanel>
        <FEIBTabPanel value="1">
          {
            socialPromoNotice.map((notice) => (
              renderNoticeList(notice)
            ))
          }
        </FEIBTabPanel>
        <FEIBTabPanel value="2">
          {
            socialAccountNotice.map((notice) => (
              renderNoticeList(notice)
            ))
          }
        </FEIBTabPanel>
      </FEIBTabContext>
      <Dialog
        isOpen={openDialog}
        onClose={() => {
          handleToggleDialog(false);
        }}
        content={dialogContent}
        action={(
          <ConfirmButtons
            mainButtonOnClick={() => {
              handleClickMainButton();
              getNoticeListByType(value);
              handleToggleDialog(false);
            }}
            subButtonOnClick={() => handleToggleDialog(false)}
          />
        )}
      />
    </NoticeWrapper>
  );
};

export default Notice;
