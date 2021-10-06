import { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import FavoriteBlockButton from 'components/FavoriteBlockButton';
import { FEIBTabContext, FEIBTabList, FEIBTab } from 'components/elements';
import { useCheckLocation, usePageInfo } from 'hooks';
import { iconGenerator } from 'pages/Favorite/favoriteGenerator';
import { setFavoriteDrawer } from 'pages/Favorite/stores/actions';
import { setIsShake } from 'pages/ShakeShake/stores/actions';
import MoreWrapper from './more.style';
import mockData from './mockData';

const More = () => {
  const mainContentRef = useRef();
  const history = useHistory();
  const dispatch = useDispatch();

  const [moreList, setMoreList] = useState([]);
  const [sectionPosition, setSectionPosition] = useState([]);
  const [tabId, setTabId] = useState('account');

  const toPage = (route) => {
    if (route === 'QRCodeTransfer') {
      dispatch(setIsShake(true));
      return;
    }
    if (route === 'favorite') {
      dispatch(setFavoriteDrawer({
        title: '我的最愛', content: '', open: true, back: null,
      }));
      return;
    }
    history.push(route);
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

  const renderBlock = (group, blocks) => blocks.map((block) => (
    <FavoriteBlockButton
      key={block.id}
      icon={iconGenerator(block.id)}
      label={block.label}
      onClick={() => toPage(block.route)}
      noBorder
    />
  ));

  const renderContent = (group) => group.map((section) => (
    <section key={section.id} className={section.group}>
      <h3 className="title">{section.groupName}</h3>
      <div className="blockGroup">
        { renderBlock(section.group, section.blocks) }
      </div>
    </section>
  ));

  const renderTabList = (tabs) => tabs.map((tab) => (
    <FEIBTab key={tab.id} label={tab.groupName} value={tab.group} />
  ));

  useCheckLocation();
  usePageInfo('/api/more');

  useEffect(() => {
    setMoreList(mockData.moreList);
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
    <MoreWrapper small>
      <FEIBTabContext value={tabId}>
        <FEIBTabList $size="small" onChange={handleChangeTabs}>
          { renderTabList(moreList) }
        </FEIBTabList>
      </FEIBTabContext>

      <div className="mainContent" ref={mainContentRef} onScroll={handleScrollContent}>
        { renderContent(moreList) }
      </div>
    </MoreWrapper>
  );
};

export default More;
