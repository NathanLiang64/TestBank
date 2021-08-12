import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';

/* Elements */
import {
  FEIBTabContext, FEIBTabList, FEIBTab,
} from 'components/elements';

/* Style */
import MoreWrapper from './more.style';

import TabPageList from './tabPageList';
import Icons from './iconList';

const More = () => {
  const history = useHistory();
  const tabTypeList = ['service', 'apply', 'withdrawal', 'invest', 'creditCard', 'loan', 'helper', 'community'];

  const [value, setValue] = useState('service');
  const [contentArray, setContentArray] = useState([]);

  const toPage = (route) => {
    history.push(route);
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
    </MoreWrapper>
  );
};

export default More;
