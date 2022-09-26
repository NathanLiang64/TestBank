import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FavoriteBlockButton from 'components/FavoriteBlockButton';
import BottomAction from 'components/BottomAction';
import SnackModal from 'components/SnackModal';
import { FEIBTab, FEIBTabContext, FEIBTabList } from 'components/elements';
// import { getFavoriteSettings, updateFavoriteItem } from 'apis/favoriteApi';
import { favIconGenerator } from './favoriteGenerator';
import { setFavoriteList } from './stores/actions';
import { getFavoriteSettingList, modifyFavoriteItem } from './api';

// 編輯我的最愛
const Favorite2 = ({ updateFavoriteList }) => {
  // 初始 groupKey 不一定是 'C'
  const [tabId, setTabId] = useState('C');
  const customFavoriteList = useSelector(({ favorite }) => favorite.customFavoriteList);
  const [editedBlockList, setEditedBlockList] = useState([]);
  const [showTip, setShowTip] = useState(false);
  const favoriteDrawer = useSelector(({ favorite }) => favorite.favoriteDrawer);
  const favoriteList = useSelector(({ favorite }) => favorite.favoriteList);
  const mainContentRef = useRef();
  const sectionsRef = useRef([]);
  const dispatch = useDispatch();

  // 點擊編輯完成
  const handleClickEditCompleted = () => {
    const result = Array.from(editedBlockList);

    // 編輯功能無順序性，若選取的最愛數量不足 10 則後面全部以空項目替換 (null)
    while (result.length < 10) {
      result.push(null);
    }
    // 更新用戶最愛的項目
    result.forEach((actKey, position) => {
      const params = { actKey, position };
      // 換成新 API
      // updateFavoriteItem(params)
      modifyFavoriteItem(params)
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
    // Fix DOM Element Access 改以 ref，移除原本的 Vanilla JavaScript 手法
    if (event.target) {
      const scrollTarget = sectionsRef.current.find((el) => el.className === value);
      scrollTarget.scrollIntoView({ behavior: 'smooth' });
    }
    // const target = document.querySelector(`.${value}`);
    // if (event.target) target.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollContent = () => {
    const { scrollTop } = mainContentRef?.current;
    const currentSection = sectionsRef.current.find((el) => el.offsetTop >= scrollTop);
    if (currentSection.className === tabId) return;
    setTabId(currentSection.className);
  };

  const handleClickBlock = (blockKey) => {
    // 添加/刪減項目邏輯
    const result = Array.from(editedBlockList);
    // TODO 應可透過 map.filter 避免 mutate 到資料
    if (result.includes(blockKey)) {
      const targetIndex = result.findIndex((actKey) => actKey === blockKey);
      result.splice(targetIndex, 1);
    } else {
      // 找到被點選 block 的 index，若 result 長度 >= 10，則秀出提示
      if (10 - result.length <= 0) {
        setShowTip(true);
        return;
      }
      // 若 result 長度小於 10，則新增 result 內的項目
      result.push(blockKey);
    }
    setEditedBlockList(result);

    // 更新 UI 樣式
    // TODO 需利用 styled-components 特性進行動態渲染，盡量避免直接進行 DOM Manipulation
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

  const renderBlockGroup = (group) => group.map((section, index) => (
    <section ref={(el) => { sectionsRef.current[index] = el; }} key={section.groupKey} className={section.groupKey}>
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
    // 換成新 API
    // getFavoriteSettings().then((response) => {
    getFavoriteSettingList().then((response) => {
      if (Array.isArray(response) && response?.length) {
        dispatch(setFavoriteList(response));
      }
    });
  }, []);

  useEffect(() => {
    if (customFavoriteList?.length) {
      const existedBlocks = [];
      customFavoriteList.forEach((existedBlock) => {
        // Question: 'Z' 開頭的 actKey 不放在 existedBlocks 內
        if (existedBlock.actKey[0] !== 'Z') existedBlocks.push(existedBlock.actKey);
      });
      setEditedBlockList(existedBlocks);
    }
  }, [customFavoriteList]);

  useEffect(() => {
    let timer = null;
    if (showTip) timer = setTimeout(() => setShowTip(false), 1000);
    return () => clearTimeout(timer);
  }, [showTip]);

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
        <button type="button" onClick={handleClickEditCompleted}>
          {`編輯完成(${editedBlockList.length})`}
        </button>
      </BottomAction>
      { showTip && <SnackModal text="最愛已選滿" /> }
    </div>
  );
};

export default Favorite2;
