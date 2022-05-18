import { useState, useEffect, useRef } from 'react';
// import { useDispatch } from 'react-redux';

/* Elements */
import Header from 'components/Header';
import FavoriteBlockButton from 'components/FavoriteBlockButton';
import { FEIBTabContext, FEIBTabList, FEIBTab } from 'components/elements';
import { startFunc } from 'utilities/BankeePlus';
import { moreApi } from 'apis';
import { iconGenerator } from 'pages/Favorite/favoriteGenerator';
// import { setFavoriteDrawer } from 'pages/Favorite/stores/actions';
// import { setIsShake } from 'pages/ShakeShake/stores/actions';

/* Styles */
import MoreWrapper from './more.style';
// import mockData from './mockData';

const More = () => {
  const mainContentRef = useRef();
  // const dispatch = useDispatch();

  const [moreList, setMoreList] = useState([]);
  const [sectionPosition, setSectionPosition] = useState([]);
  const [tabId, setTabId] = useState('account');

  const toPage = ({ actKey }) => {
    console.log('啟動 Function:', actKey);
    // if (route === 'QRCodeTransfer') {
    //   dispatch(setIsShake(true));
    //   return;
    // }
    // if (route === 'favorite') {
    //   dispatch(setFavoriteDrawer({
    //     title: '我的最愛', content: '', open: true, back: null,
    //   }));
    //   return;
    // }
    if (actKey === 'F00100') {
      window.open(process.env.REACT_APP_DEPOSIT_APPLY_URL, '_blank');
      return;
    }
    if (actKey === 'F00200') {
      window.open(process.env.REACT_APP_STOCK_APPLY_URL, '_blank');
      return;
    }
    console.log(actKey);
    startFunc(actKey);
  };

  const handleChangeTabs = (event, value) => {
    const target = document.querySelector(`.${value}`);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollContent = () => {
    const { scrollTop } = mainContentRef?.current;
    const target = sectionPosition.find((section) => section.position >= scrollTop);
    setTabId(target?.id);
  };

  const renderBlock = (group, blocks) => (
    blocks.map((block) => (
      <FavoriteBlockButton
        key={block.actKey}
        icon={iconGenerator(block.actKey)}
        label={block.name}
        onClick={() => toPage(block)}
        noBorder
      />
    ))
  );

  const renderContent = (group) => group.map((section) => (
    <section key={section.groupKey} className={section.groupKey}>
      <h3 className="title">{section.groupName}</h3>
      <div className="blockGroup">
        { renderBlock(section.group, section.items) }
      </div>
    </section>
  ));

  const renderTabList = (tabs) => tabs.map((tab) => (
    <FEIBTab key={tab.groupKey} label={tab.groupName} value={tab.groupKey} />
  ));

  useEffect(async () => {
    // db 資料內 url 為空，無法導頁，暫不接 api
    const response = await moreApi.getMoreList();
    console.log(response);
    if (response?.length > 1) {
      setMoreList(response);
    }
    // setMoreList(mockData.moreList);
  }, []);

  useEffect(() => {
    if (mainContentRef?.current) {
      const categories = Array.from(mainContentRef?.current?.children);
      const sectionPositionList = categories.map((section) => (
        { id: section.className, position: section.offsetTop }
      ));
      setSectionPosition(sectionPositionList);
    }
  }, [mainContentRef?.current]);

  return (
    <>
      <Header title="更多" />
      <MoreWrapper small>
        <FEIBTabContext value={tabId}>
          {
            moreList.length > 0 && (
              <FEIBTabList $size="small" onChange={handleChangeTabs}>
                { renderTabList(moreList) }
              </FEIBTabList>
            )
          }
        </FEIBTabContext>
        {
          moreList.length > 0 && (
            <div className="mainContent" ref={mainContentRef} onScroll={handleScrollContent}>
              { renderContent(moreList) }
            </div>
          )
        }
      </MoreWrapper>
    </>
  );
};

export default More;
