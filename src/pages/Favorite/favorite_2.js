import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FavoriteBlockButton from 'components/FavoriteBlockButton';
import BottomAction from 'components/BottomAction';
import SnackModal from 'components/SnackModal';
import { FEIBTab, FEIBTabContext, FEIBTabList } from 'components/elements';
import { getFavoriteSettings, updateFavoriteItem } from 'apis/favoriteApi';
import { favIconGenerator } from './favoriteGenerator';
import { setFavoriteList } from './stores/actions';

// 編輯我的最愛
const Favorite2 = ({ updateFavoriteList }) => {
  const [tabId, setTabId] = useState('A');
  const customFavoriteList = useSelector(({ favorite }) => favorite.customFavoriteList);
  const [editedBlockList, setEditedBlockList] = useState([]);
  const [sectionPosition, setSectionPosition] = useState([]);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const favoriteDrawer = useSelector(({ favorite }) => favorite.favoriteDrawer);
  const favoriteList = useSelector(({ favorite }) => favorite.favoriteList);
  const mainContentRef = useRef();
  const dispatch = useDispatch();

  // 點擊編輯完成
  const handleClickEditCompleted = (editedList) => {
    const result = Array.from(editedList);

    // 編輯功能無順序性，若選取的最愛數量不足 10 則後面全部以空項目替換 (null)
    if (result.length < 10) {
      const num = 10 - result.length;
      for (let i = 0; i < num; i++) result.push(null);
    }

    // 更新用戶最愛的項目
    result.forEach((actKey, position) => {
      const params = { actKey, position };
      updateFavoriteItem(params)
        .then((response) => {
          if (response.code) return;
          updateFavoriteList();
        });
      // .catch((error) => console.log('編輯最愛 err', error));
    });

    // 回到我的最愛總覽頁
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

  const handleClickBlock = (blockKey) => {
    // 添加/刪減項目邏輯
    const result = Array.from(editedBlockList);
    if (result.includes(blockKey)) {
      const targetIndex = result.findIndex((actKey) => actKey === blockKey);
      result.splice(targetIndex, 1);
    } else {
      if (10 - result.length <= 0) {
        setShowTip(true);
        return;
      }
      result.push(blockKey);
    }
    setSelectedAmount(editedBlockList.length);
    setEditedBlockList(result);

    // 更新 UI 樣式
    const buttons = Array.from(document.querySelectorAll('.favoriteBlockButton'));
    const selectedButton = buttons.find((block) => block.getAttribute('data-block') === blockKey);
    selectedButton.classList.toggle('selected');
  };

  const renderBlock = (blocks) => blocks.map((block) => (
    <FavoriteBlockButton
      key={block.actKey}
      data={block.actKey}
      icon={favIconGenerator(block.actKey)}
      label={block.name}
      className={block.isFavorite === '1' ? 'selected' : ''}
      // disabled={block.disabled}
      onClick={() => handleClickBlock(block.actKey)}
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
    if (customFavoriteList?.length) {
      const existedBlocks = [];
      customFavoriteList.forEach((existedBlock) => {
        if (existedBlock.actKey[0] !== 'Z') existedBlocks.push(existedBlock.actKey);
      });
      setEditedBlockList(existedBlocks);
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
