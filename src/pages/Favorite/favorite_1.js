import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FavoriteBlockButton from 'components/FavoriteBlockButton';
import { FEIBTab, FEIBTabContext, FEIBTabList } from 'components/elements';
import { getFavoriteSettings, updateFavoriteItem } from 'apis/favoriteApi';
import { favIconGenerator } from './favoriteGenerator';
import { setFavoriteList } from './stores/actions';

// 新增我的最愛
const Favorite1 = ({ blockOrder, updateFavoriteList }) => {
  const [tabId, setTabId] = useState('A');
  const [sectionPosition, setSectionPosition] = useState([]);
  const favoriteDrawer = useSelector(({ favorite }) => favorite.favoriteDrawer);
  const favoriteList = useSelector(({ favorite }) => favorite.favoriteList);
  const dispatch = useDispatch();
  const mainContentRef = useRef();

  const handleClickBlock = (actKey, position) => {
    const params = { actKey, position };

    // call api 新增新的項目
    updateFavoriteItem(params)
      .then((response) => {
        if (response.code) return;
        // 更新用戶最愛的項目並回到我的最愛總覽頁
        updateFavoriteList();
        favoriteDrawer.back();
      });
    // .catch((error) => console.log('編輯最愛 err', error));
  };

  // 點擊 Tab 頁籤時滾動至相應的 Section
  const handleChangeTabs = (event, value) => {
    const targetSection = document.querySelector(`.${value}`);
    if (targetSection) targetSection.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollContent = () => {
    const { scrollTop } = mainContentRef?.current;
    const target = sectionPosition.find((section) => section.position >= scrollTop);
    setTabId(target?.id);
  };

  const renderBlock = (blocks) => blocks.map((block) => (
    <FavoriteBlockButton
      key={block.actKey}
      icon={favIconGenerator(block.actKey)}
      label={block.name}
      className={block.isFavorite === '1' ? 'selected' : ''}
      // disabled={block.disabled}
      onClick={() => block.isFavorite === '0' && handleClickBlock(block.actKey, blockOrder)}
      noCheckbox
    />
  ));

  const renderBlockGroup = (group) => group.map((section) => (
    <section key={section.groupKey} className={section.groupKey}>
      <h3 className="title">{section.groupName}</h3>
      <div className="blockGroup">
        { renderBlock(section.items) }
      </div>
    </section>
  ));

  const renderTabList = (tabs) => tabs.map((tab) => (
    <FEIBTab key={tab.groupKey} label={tab.groupName} value={tab.groupKey} />
  ));

  useEffect(() => {
    getFavoriteSettings().then((response) => {
      if (Array.isArray(response) && response?.length) {
        dispatch(setFavoriteList(response));
      }
    });
  }, []);

  useEffect(() => {
    if (mainContentRef?.current) {
      const categories = Array.from(mainContentRef?.current.children);
      const sectionPositionList = categories.map((section) => (
        { id: section.className, position: section.offsetTop }
      ));
      setSectionPosition(sectionPositionList);
    }
  }, [mainContentRef]);

  return (
    <div className="addFavoritePage">
      <FEIBTabContext value={tabId}>
        <FEIBTabList $size="small" onChange={handleChangeTabs}>
          { renderTabList(favoriteList) }
        </FEIBTabList>
      </FEIBTabContext>

      <div className="mainContent" ref={mainContentRef} onScroll={handleScrollContent}>
        { renderBlockGroup(favoriteList) }
      </div>
    </div>
  );
};

export default Favorite1;
