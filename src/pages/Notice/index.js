/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';
import { noticeApi } from 'apis';
/* Elements */
import EditIcon from 'assets/images/icons/editIcon.svg';
import SettingIcon from 'assets/images/icons/settingIcon.svg';
import {
  FEIBTabContext,
  FEIBTabList,
  FEIBTab,
  // FEIBTabPanel,
  // FEIBBorderButton,
} from 'components/elements';
import BottomDrawer from 'components/BottomDrawer';
import MessageItem from './messageItem';

/* Styles */
import NoticeWrapper from './notice.style';

const Notice = () => {
  const history = useHistory();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [tabValue, setTabValue] = useState('0');
  const [messagesList, setMessagesList] = useState([
    {
      content: 'aHR0cDovLzEwLjQ4LjIwLjk2L3VwbG9hZC9EaWdpdGFsQmFuay9odG1sL0FQUC90ZXN0Lmh0bWw=',
      id: '2021042800399208',
      outline: '5ris6Kmm6aCQ6Kit5YWs5ZGK',
      sendTime: '2021/04/28 10:47',
      status: 'R',
      type: 'D',
    },
    {
      content: 'aHR0cDovLzEwLjQ4LjIwLjk2L3VwbG9hZC9EaWdpdGFsQmFuay9odG1sL0FQUC90ZXN0Lmh0bWw=',
      id: '2021042800399209',
      outline: '5ris6Kmm6aCQ6Kit5YWs5ZGK',
      sendTime: '2021/04/28 10:47',
      status: '0',
      type: 'D',
    },
  ]);

  // 跳轉通知設定頁
  const toSettingPage = () => {
    history.push('/noticeSetting');
  };

  const getNoticeItem = async () => {
    const data = await noticeApi.getNoticeItem({});
    console.log(data.notices.filter((item) => item.level === 1));
    console.log(data.notices);
  };

  // 取得通知列表
  const getNotices = async () => {
    const data = await noticeApi.getNotices({
      channelCode: 'HHB_A',
    });
    setMessagesList(data.messages);
  };

  // 選擇通知類別
  const handleTabChange = (event, type) => {
    setTabValue(type);
  };

  // 開關編輯選單
  const handleOpenDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  // 已讀單項訊息
  const readSpecMessage = (msg) => {
    if (msg.status !== 'R') {
      const newMessagesList = messagesList
        .map((item) => {
          if (msg.id === item.id) {
            item.status = 'R';
          }
          return item;
        });
      setMessagesList(newMessagesList);
    }
  };

  // 已讀全部訊息
  const readAllMessages = () => {
    const newMessageList = messagesList
      .map((item) => ({
        ...item,
        status: 'R',
      }));
    setMessagesList(newMessageList);
    handleOpenDrawer();
  };

  // 刪除單項訊息
  const deleteSpecMessage = (msg) => {
    const newMessagesList = messagesList.filter((item) => item.id !== msg.id);
    setMessagesList(newMessagesList);
  };

  // 刪除全部訊息
  const deleteAllMessages = () => {
    const newMessages = [];
    setMessagesList(newMessages);
    handleOpenDrawer();
  };

  const renderMessagesList = () => messagesList.map((item) => (
    <MessageItem
      key={item.id}
      item={item}
      readClick={() => readSpecMessage(item)}
      deleteClick={() => deleteSpecMessage(item)}
    />
  ));

  const renderEditList = () => (
    <ul className="noticeEditList">
      <li onClick={readAllMessages}>
        <div className="mockIcon" />
        全部已讀
      </li>
      <li onClick={deleteAllMessages}>
        <div className="mockIcon" />
        全部刪除
      </li>
    </ul>
  );

  useCheckLocation();
  usePageInfo('/api/notice');

  useEffect(() => {
    // getNoticeItem();
    getNotices();
  }, []);

  return (
    <NoticeWrapper>
      <div className="lighterBlueLine" />
      <div className="noticeContainer">
        <div className="settingEditContainer">
          <div className="btn setting" onClick={toSettingPage}>
            設定
            <img src={SettingIcon} alt="" />
          </div>
          <div
            className="btn edit"
            onClick={handleOpenDrawer}
          >
            編輯
            <img src={EditIcon} alt="" />
          </div>
        </div>
        <FEIBTabContext value={tabValue}>
          <FEIBTabList $size="small" onChange={handleTabChange}>
            <FEIBTab label="帳務" value="0" />
            <FEIBTab label="社群" value="1" />
            <FEIBTab label="公告" value="2" />
            <FEIBTab label="安全" value="3" />
            <FEIBTab label="全部" value="4" />
          </FEIBTabList>
        </FEIBTabContext>
        {
          renderMessagesList()
        }
        <BottomDrawer
          isOpen={openDrawer}
          onClose={handleOpenDrawer}
          content={renderEditList()}
        />
      </div>
    </NoticeWrapper>
  );
};

export default Notice;
