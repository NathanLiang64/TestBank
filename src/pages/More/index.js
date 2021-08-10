import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';
import { cardLessATMApi } from 'apis';

/* Elements */
import {
  FEIBTabContext, FEIBTabList, FEIBTab, FEIBButton,
} from 'components/elements';
import ConfirmButtons from 'components/ConfirmButtons';
import Dialog from 'components/Dialog';

/* Style */
import MoreWrapper from './more.style';

import TabPageList from './tabPageList';
import Icons from './iconList';

const More = () => {
  const history = useHistory();
  const tabTypeList = ['service', 'apply', 'withdrawal', 'invest', 'creditCard', 'loan', 'helper', 'community'];

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState('');
  const [dialogButtons, setDialogButtons] = useState(null);
  // const [dialogCallback, setDialogCallback] = useState(() => () => setOpenDialog(false));
  const [value, setValue] = useState('service');
  const [contentArray, setContentArray] = useState([]);

  // 設定 Dialog 內容
  const generateDailog = (content, buttons) => {
    setDialogContent(content);
    setDialogButtons(buttons);
    setOpenDialog(true);
  };

  // 檢查無卡提款狀態; 0=未申請, 1=已申請未開通, 2=已開通, 3=已註銷, 4=已失效, 5=其他
  const getStatusCode = async () => {
    const statusCodeResponse = await cardLessATMApi.getStatusCode();
    const { statusCode, message } = statusCodeResponse.data;
    switch (statusCode) {
      case 1:
        generateDailog(
          '愛方便的您，怎麼少了無卡提款服務，快來啟用吧！',
          (
            <ConfirmButtons
              mainButtonValue="確認"
              mainButtonOnClick={
                () => {
                  setOpenDialog(false);
                  history.push('/cardLessATM');
                }
              }
              subButtonValue="取消"
              subButtonOnClick={() => setOpenDialog(false)}
            />
          ),
        );
        break;

      case 2:
        generateDailog(
          '已完成開通無卡提款服務',
          (
            <FEIBButton
              onClick={() => {
                setOpenDialog(false);
                history.push('/cardLessATM1');
              }}
            >
              確定
            </FEIBButton>
          ),
        );
        break;

      default:
        setDialogContent(message);
        setDialogButtons((
          <FEIBButton onClick={() => setOpenDialog(false)}>確定</FEIBButton>
        ));
        setOpenDialog(true);
        break;
    }
  };

  // 檢查晶片狀態；“01”=新申請 “02”=尚未開卡 “04”=已啟用 “05”=已掛失 “06”=已註銷 “07”=已銷戶 “08”=臨時掛失中 “09”=申請中
  const getCardStatus = async () => {
    const cardStatusResponse = await cardLessATMApi.getCardStatus();
    const { cardStatus, message } = cardStatusResponse.data;
    console.log(cardStatus, message);
    switch (cardStatus) {
      case 1:
        generateDailog(
          '晶片卡申請中！',
          (<FEIBButton onClick={() => setOpenDialog(false)}>確定</FEIBButton>),
        );
        break;

      case 2:
        generateDailog(
          '請先完成金融卡開卡以啟用無卡提款服務！',
          (
            <ConfirmButtons
              mainButtonValue="我要開卡"
              mainButtonOnClick={() => console.log('跳轉到金融開卡頁')}
              subButtonValue="取消"
              subButtonOnClick={() => setOpenDialog(false)}
            />
          ),
        );
        break;

      case 4:
        getStatusCode();
        break;

      default:
        setDialogContent(message);
        setDialogButtons((
          <FEIBButton onClick={() => setOpenDialog(false)}>確定</FEIBButton>
        ));
        setOpenDialog(true);
        break;
    }
  };

  const toPage = (route) => {
    if (route) {
      switch (route) {
        case '/cardLessATM':
          getCardStatus();
          break;
        default:
          history.push(route);
          break;
      }
    }
  };

  const handleTabChange = (event, type) => {
    const main = document.getElementsByTagName('main')[0];
    main.scrollTop = contentArray.find((item) => item.id === type).offsetTop;
    setValue(type);
  };

  const handleScroll = (e) => {
    const { scrollTop } = e.target;
    const currentContent = contentArray.find((item) => item.offsetTop >= scrollTop);
    if (currentContent.id !== value) {
      setValue(currentContent.id);
    }
  };

  const renderDialog = () => (
    <Dialog
      isOpen={openDialog}
      onClose={() => setOpenDialog(false)}
      content={<p>{dialogContent}</p>}
      action={(
        dialogButtons
      )}
    />
  );

  const renderTabs = () => (
    <div className="tabContainer">
      <FEIBTabContext value={value}>
        <FEIBTabList onChange={handleTabChange}>
          <FEIBTab label="帳戶服務" value="service" />
          <FEIBTab label="申請" value="apply" />
          <FEIBTab label="轉帳提款" value="withdrawal" />
          <FEIBTab label="投資理財" value="invest" />
          <FEIBTab label="信用卡" value="creditCard" />
          <FEIBTab label="貸款" value="loan" />
          <FEIBTab label="金融助手" value="helper" />
          <FEIBTab label="社群圈" value="community" />
        </FEIBTabList>
      </FEIBTabContext>
    </div>
  );

  const renderIconButton = (type) => TabPageList[type].list.map((item) => (
    <div key={item.value} className="iconButton" onClick={() => toPage(item.route)}>
      <svg width="40" height="40">
        <image xlinkHref={Icons[type + item.value]} width="40" height="40" />
      </svg>
      <span>
        { item.label }
      </span>
    </div>
  ));

  const renderContent = () => tabTypeList.map((item) => (
    <div key={item} id={item} className="contentContainer">
      <div className="title">
        { TabPageList[item].mainLabel }
      </div>
      <div className="content">
        { renderIconButton(item) }
      </div>
    </div>
  ));

  useCheckLocation();
  usePageInfo('/api/more');

  useEffect(() => {
    const contentList = document.getElementsByClassName('contentContainer');
    const contentArr = [];
    for (const item of contentList) {
      contentArr.push({
        id: item.id,
        clientHeight: item.clientHeight,
        offsetTop: item.offsetTop - 72,
      });
    }
    setContentArray(contentArr);
  }, []);

  return (
    <MoreWrapper onScroll={handleScroll} small>
      { renderTabs() }
      { renderContent() }
      { renderDialog() }
    </MoreWrapper>
  );
};

export default More;
