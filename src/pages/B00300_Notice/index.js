/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { startFunc } from 'utilities/AppScriptProxy';

/* Elements */
import Layout from 'components/Layout/Layout';
import EditIcon from 'assets/images/icons/editIcon.svg';
import SettingIcon from 'assets/images/icons/settingIcon.svg';
import {
  FEIBTabContext,
  FEIBTabList,
  FEIBTab,
  FEIBTabPanel,
  // FEIBBorderButton,
} from 'components/elements';
import BottomDrawer from 'components/BottomDrawer';
import MessageItem from './messageItem';
import {
  queryLastPush,
  chgPushStatus,
  deletePush,
  chgAllPushStatus,
  deleteAllPush,
} from './api';

/* Styles */
import NoticeWrapper from './notice.style';

const Notice = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [tabValue, setTabValue] = useState('A');
  const [allMessagesList, setAllMessagesList] = useState([]);
  const [pMessagesList, setPmessagesList] = useState([]);
  const [aMessagesList, setAmessagesList] = useState([]);
  const [cMessagesList, setCmessagesList] = useState([]);
  const [sMessagesList, setSmessagesList] = useState([]);

  // 跳轉通知設定頁
  const toSettingPage = () => {
    startFunc('S00400');
  };

  // 取得通知列表
  const getNotices = async () => {
    const { code, data } = await queryLastPush();
    if (code === '0000') {
      const allMsg = data;
      const pMsg = data.filter((item) => item.msgType === 'P');
      const aMsg = data.filter((item) => item.msgType === 'A');
      const cMsg = data.filter((item) => item.msgType === 'C');
      const sMsg = data.filter((item) => item.msgType === 'S');
      setAllMessagesList(allMsg);
      setPmessagesList(pMsg);
      setAmessagesList(aMsg);
      setCmessagesList(cMsg);
      setSmessagesList(sMsg);
    }
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
  const readSpecMessage = async (msg) => {
    if (msg.status !== 'R') {
      const param = {
        msgId: msg.msgId,
      };
      await chgPushStatus(param);
      getNotices();
    }
    if (msg?.msgUrl) {
      window.location.href = msg?.msgUrl;
    }
  };

  // 已讀全部訊息
  const readAllMessages = async () => {
    const param = {
      msgType: tabValue !== '0' ? tabValue : '',
    };
    await chgAllPushStatus(param);
    getNotices();
    handleOpenDrawer();
  };

  // 刪除單項訊息
  const deleteSpecMessage = async (msg) => {
    const param = {
      msgId: msg.msgId,
    };
    await deletePush(param);
    getNotices();
  };

  // 刪除全部訊息
  const deleteAllMessages = async () => {
    const param = {
      msgType: tabValue !== '0' ? tabValue : '',
    };
    await deleteAllPush(param);
    handleOpenDrawer();
  };

  const renderMessagesList = (msgList) => msgList.map((item) => (
    <MessageItem
      key={item?.msgId}
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

  useEffect(() => {
    getNotices();
  }, []);

  return (
    <Layout title="訊息通知">
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
              <FEIBTab label="帳務" value="A" />
              <FEIBTab label="社群" value="C" />
              <FEIBTab label="公告" value="P" />
              <FEIBTab label="安全" value="S" />
              <FEIBTab label="全部" value="0" />
            </FEIBTabList>
            <FEIBTabPanel value="A">
              {
                renderMessagesList(aMessagesList)
              }
            </FEIBTabPanel>
            <FEIBTabPanel value="C">
              {
                renderMessagesList(cMessagesList)
              }
            </FEIBTabPanel>
            <FEIBTabPanel value="P">
              {
                renderMessagesList(pMessagesList)
              }
            </FEIBTabPanel>
            <FEIBTabPanel value="S">
              {
                renderMessagesList(sMessagesList)
              }
            </FEIBTabPanel>
            <FEIBTabPanel value="0">
              {
                renderMessagesList(allMessagesList)
              }
            </FEIBTabPanel>
          </FEIBTabContext>
          <BottomDrawer
            isOpen={openDrawer}
            onClose={handleOpenDrawer}
            content={renderEditList()}
          />
        </div>
      </NoticeWrapper>
    </Layout>
  );
};

export default Notice;
