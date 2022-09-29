/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import BottomDrawer from 'components/BottomDrawer';
import BlockEmpty from 'assets/images/favoriteBlock/blockEmpty.png';
import { EditIcon, RemoveIcon } from 'assets/images/icons';
import { showCustomPrompt } from 'utilities/MessageModal';
import Layout from 'components/Layout/Layout';

import { closeFunc } from 'utilities/AppScriptProxy';
import { useHistory } from 'react-router';
import S00100_1 from './S00100_1';
import { blockBackgroundGenerator, iconGenerator } from './favoriteGenerator';
import FavoriteDrawerWrapper from './favorite.style';
import { generateTrimmedList } from './utils';
import { deleteFavoriteItem, getFavoriteList } from './api';

const Favorite = () => {
  const initialViewControl = {
    title: '我的最愛',
    content: 'home',
    specifiedLocation: '',
  };
  const [viewControl, setViewControl] = useState(initialViewControl);
  const [pressTimer, setPressTimer] = useState(0);
  const [showRemoveButton, setShowRemoveButton] = useState(false);
  const [favoriteList, setFavoriteList] = useState([]);
  const history = useHistory();

  // 取得用戶我的最愛清單
  const updateFavoriteList = async () => {
    try {
      const res = await getFavoriteList();
      if (!res) throw new Error('updateFavortieList response is empty');
      if (res) setFavoriteList(res);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCloseDrawer = () => {
    setShowRemoveButton(false);
    closeFunc();
  };

  const handleOpenView = (viewName) => {
    setViewControl({
      title: viewName === 'add' ? '新增我的最愛' : '編輯我的最愛',
      content: viewName,
    });
    setShowRemoveButton(false);
  };

  // 回到我的最愛首頁
  const back2MyFavorite = () => setViewControl(initialViewControl);

  // 點擊移除按鈕
  const handleClickRemoveBlock = async ({actKey, name}) => {
    await showCustomPrompt({
      message: `確定要從我的最愛刪除 ${name} 嗎?`,
      onOk: async () => {
        await deleteFavoriteItem(actKey);
        updateFavoriteList();
      },
      cancelContent: '取消',
    });
  };

  // 長按編輯
  const handleEditBlock = () => setShowRemoveButton(true);
  const handleTouchStart = () => setPressTimer(setTimeout(handleEditBlock, 800));
  const handleTouchEnd = () => pressTimer && clearTimeout(pressTimer);

  // 渲染我的最愛列表
  const renderBlocksElement = (blocks) => blocks.map((block, index) => {
    let handleBlockClick = () => handleOpenView('add', index - 2);
    if (block.actKey) {
      if (showRemoveButton) handleBlockClick = null;
      else handleBlockClick = () => history.push(`/${block.actKey}`);
    }
    return (
      <button
        type="button"
        key={block.actKey || index - 2}
        onTouchStart={block.actKey ? handleTouchStart : null}
        onTouchEnd={block.actKey ? handleTouchEnd : null}
        onClick={handleBlockClick}
      >
        {
        block.actKey
          ? (
            <>
              { (showRemoveButton && block.position >= 0) && (
              <span
                className="removeButton"
                onClick={() => handleClickRemoveBlock({actKey: block.actKey, name: block.name})}
              >
                <RemoveIcon />
              </span>
              ) }
              <img src={blockBackgroundGenerator(index)} alt="block" />
              {iconGenerator(block.actKey)}
              {block.name}
            </>
          )
          : <img src={block} alt="empty" />
      }
      </button>
    );
  });

  const renderBlocks = (list) => {
    const blocks = list.reduce((acc, block) => {
      const position = parseInt(block.position, 10);
      if (position < 0) acc.push(block);
      // position + 2 -> 前 2 個是固定的、不可更動，從陣列第三筆開始排序
      if (position >= 0) acc[position + 2] = block;
      return acc;
    }, []);

    // 排列已選的最愛功能項目，空欄位補上空白區塊
    const trimmedList = generateTrimmedList(blocks, 12, BlockEmpty);
    return renderBlocksElement(trimmedList);
  };

  const defaultContent = () => (
    <div className="defaultPage">
      <button type="button" className="editButton" onClick={() => handleOpenView('edit')}>
        編輯
        <EditIcon />
      </button>
      <div className="favoriteArea">
        { favoriteList.length ? renderBlocks(favoriteList) : null }
      </div>
    </div>
  );

  const drawerController = () => {
    if (viewControl.content === 'home') return defaultContent();
    return (
      <S00100_1
        updateFavoriteList={updateFavoriteList}
        back2MyFavorite={back2MyFavorite}
        isEditAction={viewControl.content === 'edit'}
        favoriteList={favoriteList}
      />
    );
  };

  const closeEditModeHandler = (e) => {
    const {nodeName} = e.target;
    if (nodeName === 'BUTTON' || nodeName === 'svg') return;
    if (showRemoveButton) setShowRemoveButton(false);
  };

  useEffect(() => {
    updateFavoriteList();
  }, []);

  return (
    <Layout>
      <BottomDrawer
        noScrollable
        title={viewControl.title}
        isOpen
        onClose={handleCloseDrawer}
        onBack={viewControl.content !== 'home' ? back2MyFavorite : null}
        content={(
          <FavoriteDrawerWrapper onClick={closeEditModeHandler}>
            { drawerController() }
          </FavoriteDrawerWrapper>
        )}
      />
    </Layout>
  );
};

export default Favorite;
