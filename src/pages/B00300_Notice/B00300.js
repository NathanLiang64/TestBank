import { useState } from 'react';
import { queryPushBind, startFunc } from 'utilities/AppScriptProxy';
import { showDrawer, closeDrawer } from 'utilities/MessageModal';

/* Elements */
import Layout from 'components/Layout/Layout';
import EditIcon from 'assets/images/icons/editIcon.svg';
import SettingIcon from 'assets/images/icons/settingIcon.svg';
import {
  FEIBTabContext,
  FEIBTabList,
  FEIBTab,
  FEIBTabPanel,
} from 'components/elements';
import EmptyData from 'components/EmptyData';
import { FuncID } from 'utilities/FuncID';
import MessageItem from './messageItem';
import {
  queryLastPush,
  chgPushStatus,
  deletePush,
  chgAllPushStatus,
  deleteAllPush,
} from './api';

/* Styles */
import NoticeWrapper from './B00300.style';

const Notice = () => {
  const [tabValue, setTabValue] = useState('A');
  const [allMessagesList, setAllMessagesList] = useState([]);
  const [pMessagesList, setPmessagesList] = useState([]);
  const [aMessagesList, setAmessagesList] = useState([]);
  const [cMessagesList, setCmessagesList] = useState([]);
  const [sMessagesList, setSmessagesList] = useState([]);

  // 通知類別及代碼
  const msgTypeList = [
    {
      label: '帳務',
      value: 'A',
      list: aMessagesList,
    },
    {
      label: '社群',
      value: 'C',
      list: cMessagesList,
    },
    {
      label: '公告',
      value: 'P',
      list: pMessagesList,
    },
    {
      label: '安全',
      value: 'S',
      list: sMessagesList,
    },
    {
      label: '全部',
      value: '0',
      list: allMessagesList,
    },
  ];

  // 跳轉通知設定頁
  const toSettingPage = () => startFunc(FuncID.S00400);

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

  // 如果有至少一個未讀，回傳true
  const handleMarkItem = (list) => list.filter((item) => item.status !== 'R').length === 0;

  // 選擇通知類別
  const handleTabChange = (event, type) => {
    setTabValue(type);
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
    closeDrawer();
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
    closeDrawer();
  };

  const renderMessagesList = (msgList) => msgList.map((item) => (
    <MessageItem
      key={item?.msgId}
      item={item}
      readClick={() => readSpecMessage(item)}
      deleteClick={() => deleteSpecMessage(item)}
    />
  ));

  // 無通知內容顯示相應圖示及文字
  const renderTabPanel = (list) => (list.length > 0 ? renderMessagesList(list) : <div className="emptyData"><EmptyData content="沒有最新消息" /></div>);

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

  // 開啟編輯選單
  const handleOpenDrawer = () => {
    showDrawer(
      '',
      renderEditList(),
    );
  };

  /**
   * 檢查是否可以開啟這個頁面。
   * @returns {Promise<String>} 傳回驗證結果的錯誤訊息；若是正確無誤時，需傳回 null
   */
  const inspector = async () => {
    // 確認訊息通知是否同意
    const { PushBindStatus } = await queryPushBind();
    if (PushBindStatus) {
      await getNotices();
    } else {
      // 未綁定直接轉至訊息通知設定頁面
      startFunc(FuncID.S00400);
    }
  };

  return (
    <Layout title="訊息通知" inspector={inspector}>
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
              {msgTypeList.map((type) => <FEIBTab key={type.value} label={type.label} value={type.value} className={handleMarkItem(type.list) ? '' : 'unReadTab'} />)}
            </FEIBTabList>
            {msgTypeList.map((type) => <FEIBTabPanel key={type.value} value={type.value}>{renderTabPanel(type.list)}</FEIBTabPanel>)}
          </FEIBTabContext>
        </div>
      </NoticeWrapper>
    </Layout>
  );
};

export default Notice;
