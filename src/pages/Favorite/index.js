import { useEffect, useState } from 'react';
import BottomDrawer from 'components/BottomDrawer';
import BlockEmpty from 'assets/images/favoriteBlock/blockEmpty.png';
import { EditIcon, RemoveIcon } from 'assets/images/icons';
// eslint-disable-next-line no-unused-vars
import Favorite2New from './favorite_2_new';
// eslint-disable-next-line no-unused-vars
import Favorite3 from './favorite_3';
import { blockBackgroundGenerator, iconGenerator } from './favoriteGenerator';
import FavoriteDrawerWrapper from './favorite.style';

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

  // 取得用戶我的最愛清單
  const updateFavoriteList = () => {
    getFavoriteList().then((response) => {
      if (response.code) return;
      setFavoriteList(response);
    });
  };

  const handleCloseDrawer = () => {
    setShowRemoveButton(false);
  };

  const handleOpenView = (viewName, order) => {
    setViewControl({
      title: viewName === 'add' ? '新增我的最愛' : '編輯我的最愛',
      content: viewName,
      specifiedLocation: order,
    });
    setShowRemoveButton(false);
  };

  // 回到我的最愛首頁
  const back2MyFavorite = () => setViewControl(initialViewControl);

  // 點擊移除按鈕
  const handleClickRemoveBlock = async (actKey) => {
    try {
      await deleteFavoriteItem(actKey);
      updateFavoriteList();
    } catch (err) {
      console.log('刪除最愛 err', err);
    }
  };

  // 長按編輯
  const handleEditBlock = () => setShowRemoveButton(true);
  const handleTouchStart = () => setPressTimer(setTimeout(handleEditBlock, 800));
  const handleTouchEnd = () => pressTimer && clearTimeout(pressTimer);

  // 渲染我的最愛列表
  const renderBlocksElement = (blocks) => blocks.map((block, index) => (
    <button
      type="button"
      key={block.actKey || index - 2}
      onTouchStart={block.actKey ? handleTouchStart : null}
      onTouchEnd={block.actKey ? handleTouchEnd : null}
      onClick={block.actKey ? null : () => handleOpenView('add', index - 2)}
    >
      {
        block.actKey
          ? (
            <>
              { (showRemoveButton && block.position >= 0) && (
              <span
                className="removeButton"
                onClick={() => handleClickRemoveBlock(block.actKey)}
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
  ));

  const renderBlocks = (list) => {
    const blocks = [];
    const blocksLength = 12;
    // 排列已選的最愛功能項目，空欄位補上空白區塊
    list.forEach((block) => {
      const position = parseInt(block.position, 10);
      if (position < 0) blocks.push(block);
      // position + 2 -> 前 2 個是固定的、不可更動，從陣列第三筆開始排序
      if (position >= 0) blocks[position + 2] = block;
    });
    // 空白區塊補上 imgage
    for (let i = 0; i < blocksLength; i++) {
      if (!blocks[i]) blocks[i] = BlockEmpty;
    }
    return renderBlocksElement(blocks);
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
      <Favorite3
        updateFavoriteList={updateFavoriteList}
        back2MyFavorite={back2MyFavorite}
        specifiedLocation={viewControl.specifiedLocation}
        isEditAction={viewControl.content === 'edit'}
        favoriteList={favoriteList}
      />
      // <Favorite2New
      //   updateFavoriteList={updateFavoriteList}
      //   back2MyFavorite={back2MyFavorite}
      //   specifiedLocation={viewControl.specifiedLocation}
      //   actionType={viewControl.content}
      //   favoriteList={favoriteList}
      // />
    );
  };

  useEffect(() => {
    updateFavoriteList();
  }, []);

  // console.log('ordered', favoriteList);
  return (
    <BottomDrawer
      noScrollable
      title={viewControl.title}
      isOpen
      onClose={handleCloseDrawer}
      onBack={viewControl.content !== 'home' ? back2MyFavorite : null}
      content={(
        <FavoriteDrawerWrapper>
          { drawerController() }
        </FavoriteDrawerWrapper>
      )}
    />
  );
};

export default Favorite;
