import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FavoriteBlockButton from 'components/FavoriteBlockButton';
import BottomAction from 'components/BottomAction';
import { FEIBTab, FEIBTabContext, FEIBTabList } from 'components/elements';
import { iconGenerator } from './favoriteGenerator';
import { setCustomFavoriteList } from './stores/actions';
import SnackModal from '../../components/SnackModal';

// 編輯我的最愛
const Favorite2 = () => {
  const [tabId, setTabId] = useState('account');
  const customFavoriteList = useSelector(({ favorite }) => favorite.customFavoriteList);
  const [editedBlockList, setEditedBlockList] = useState([]);
  const [sectionPosition, setSectionPosition] = useState([]);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const favoriteDrawer = useSelector(({ favorite }) => favorite.favoriteDrawer);
  const favoriteList = useSelector(({ favorite }) => favorite.favoriteList);
  const dispatch = useDispatch();
  const mainContentRef = useRef();

  const handleClickEditCompleted = (editedList) => {
    // updated customFavoriteList
    const result = favoriteList.map((group) => (
      group.blocks.filter((item) => editedList.find((name) => item.id === name))
    )).flat();
    result.forEach((block, index) => {
      block.selected = true;
      block.selectedOrder = index + 1;
    });
    dispatch(setCustomFavoriteList(result));

    // updated favoriteList
    // call api to remove selected blocks
    // const filteredFavoriteList = JSON.parse(JSON.stringify(favoriteList));
    // filteredFavoriteList.forEach((group) => {
    //   group.blocks.forEach((block) => {
    //     editedList.forEach((blockName) => {
    //       if (block.id === blockName) block.selected = true;
    //     })
    //   })
    // });
    // dispatch(setFavoriteList(filteredFavoriteList));

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

  // useEffect(()=>console.log(editedBlockList), [editedBlockList?.length]);

  const handleClickBlock = (group, blockId) => {
    // 添加/刪減項目邏輯
    const result = editedBlockList;
    if (editedBlockList.includes(blockId)) {
      const targetIndex = editedBlockList.findIndex((id) => id === blockId);
      result.splice(targetIndex, 1);
    } else {
      if (10 - editedBlockList.length <= 0) {
        setShowTip(true);
        return;
      }
      result.push(blockId);
    }
    // console.log('result', result);
    setSelectedAmount(editedBlockList.length);
    setEditedBlockList(result);

    // 更新 UI 樣式
    const groupDOM = document.querySelector(`.${group}`);
    const blocks = Array.from(groupDOM.children[1].children);
    const blockDOM = blocks.find((block) => block.getAttribute('data-block') === blockId);
    blockDOM.classList.toggle('selected');

    // 新增 block 至 customFavoriteList
    // const updatedCustomFavoriteList = customFavoriteList;
    // updatedCustomFavoriteList.push(targetBlock);
    // dispatch(setCustomFavoriteList(updatedCustomFavoriteList));

    // const targetGroup = favoriteList.find((targetGroup) => targetGroup.group === group);
    // const targetBlock = targetGroup.blocks.find((block) => block.id === blockId);
    // console.log(targetBlock);
  };

  const renderBlock = (group, blocks) => blocks.map((block) => (
    <FavoriteBlockButton
      key={block.id}
      data={block.id}
      icon={iconGenerator(block.id)}
      label={block.label}
      className={block.selected ? 'selected' : ''}
      disabled={block.disabled}
      onClick={() => handleClickBlock(group, block.id)}
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
    if (customFavoriteList.length) {
      customFavoriteList.forEach((existedBlock) => editedBlockList.push(existedBlock.id));
    }
  }, [customFavoriteList]);

  useEffect(() => {
    if (editedBlockList) setSelectedAmount(editedBlockList.length);
  }, [editedBlockList?.length]);

  useEffect(() => {
    let timer = null;
    if (showTip) timer = setTimeout(() => setShowTip(false), 1000);
    return () => clearTimeout(timer);
  }, [showTip]);

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
    <div className="editFavoritePage">
      <FEIBTabContext value={tabId}>
        <FEIBTabList $size="small" onChange={handleChangeTabs}>
          { renderTabList(favoriteList) }
        </FEIBTabList>
      </FEIBTabContext>

      <div className="tipArea">
        <p>您最多可以選取10項服務加入我的最愛！</p>
      </div>

      <div className="mainContent" ref={mainContentRef} onScroll={handleScrollContent}>
        { renderBlockGroup(favoriteList) }
      </div>

      <BottomAction position={0}>
        <button type="button" onClick={() => handleClickEditCompleted(editedBlockList)}>
          {`編輯完成(${selectedAmount})`}
        </button>
      </BottomAction>
      { showTip && <SnackModal text="最愛已選滿" /> }
    </div>
  );
};

export default Favorite2;
