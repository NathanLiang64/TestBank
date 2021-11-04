import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FavoriteBlockButton from 'components/FavoriteBlockButton';
import { FEIBTab, FEIBTabContext, FEIBTabList } from 'components/elements';
import { iconGenerator } from './favoriteGenerator';
import { setCustomFavoriteList } from './stores/actions';

// 新增我的最愛
const Favorite1 = ({ blockOrder }) => {
  const [tabId, setTabId] = useState('account');
  const [sectionPosition, setSectionPosition] = useState([]);
  const favoriteDrawer = useSelector(({ favorite }) => favorite.favoriteDrawer);
  const favoriteList = useSelector(({ favorite }) => favorite.favoriteList);
  const customFavoriteList = useSelector(({ favorite }) => favorite.customFavoriteList);
  const dispatch = useDispatch();
  const mainContentRef = useRef();

  const handleClickBlock = (group, blockId) => {
    const targetGroup = favoriteList.find((item) => item.group === group);
    const targetBlock = targetGroup.blocks.find((block) => block.id === blockId);
    targetBlock.selected = true;
    targetBlock.selectedOrder = blockOrder;
    // call api 新增 customFavoriteList

    // 新增 block 至 customFavoriteList
    const updatedCustomFavoriteList = JSON.parse(JSON.stringify(customFavoriteList));
    updatedCustomFavoriteList.push(targetBlock);
    dispatch(setCustomFavoriteList(updatedCustomFavoriteList));
    favoriteDrawer.back();
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
      className={block.selected ? 'selected' : ''}
      disabled={block.disabled}
      onClick={() => !block.selected && handleClickBlock(group, block.id)}
    />
  ));

  const renderBlockGroup = (group) => group.map((section) => (
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
