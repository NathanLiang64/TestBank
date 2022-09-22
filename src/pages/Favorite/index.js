import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import BottomDrawer from 'components/BottomDrawer';
// eslint-disable-next-line no-unused-vars
import { updateFavoriteItem } from 'apis/favoriteApi';
import BlockEmpty from 'assets/images/favoriteBlock/blockEmpty.png';
import { EditIcon, RemoveIcon } from 'assets/images/icons';
import Favorite1 from './favorite_1';
// eslint-disable-next-line no-unused-vars
import Favorite2 from './favorite_2';
// eslint-disable-next-line no-unused-vars
import Favorite2New from './favorite_2_new';
import { setFavoriteDrawer, setCustomFavoriteList } from './stores/actions';
import { blockBackgroundGenerator, favIconGenerator } from './favoriteGenerator';
import FavoriteDrawerWrapper from './favorite.style';

import { deleteFavoriteItem, getFavoriteList } from './api';

const Favorite = () => {
  const [pressTimer, setPressTimer] = useState(0);
  const [blockOrder, setBlockOrder] = useState(0);
  const [showRemoveButton, setShowRemoveButton] = useState(false);
  const favoriteDrawer = useSelector(({ favorite }) => favorite.favoriteDrawer);
  const customFavoriteList = useSelector(({ favorite }) => favorite.customFavoriteList);
  const dispatch = useDispatch();

  // 取得用戶我的最愛清單
  const updateFavoriteList = () => {
    // Fix 改成 callAPI 方式進行 request
    getFavoriteList().then((response) => {
      if (response.code) return;
      dispatch(setCustomFavoriteList(response));
    });
  };

  const handleCloseDrawer = () => {
    setShowRemoveButton(false);
    dispatch(setFavoriteDrawer({ ...favoriteDrawer, open: false }));
  };

  const handleOpenView = (viewName, order) => {
    setBlockOrder(order);
    dispatch(setFavoriteDrawer({
      ...favoriteDrawer,
      title: viewName === 'add' ? '新增我的最愛' : '編輯我的最愛',
      content: viewName,
      back: () => {
        dispatch(setFavoriteDrawer({
          ...favoriteDrawer,
          title: '我的最愛',
          content: '',
          back: null,
        }));
      },
    }));
    setShowRemoveButton(false);
  };

  // 點擊移除按鈕
  const handleClickRemoveBlock = (actKey) => {
    // const params = {
    //   actKey: null,
    //   position,
    // };

    // Fix 改成 callAPI 方式進行 request
    deleteFavoriteItem(actKey)
      .then((response) => {
        if (response.code) return;
        updateFavoriteList();
      })
      .catch((error) => console.log('刪除最愛 err', error));
  };

  // 長按編輯
  const handleEditBlock = () => setShowRemoveButton(true);
  const handleTouchStart = () => setPressTimer(setTimeout(handleEditBlock, 800));
  const handleTouchEnd = () => pressTimer && clearTimeout(pressTimer);

  const renderBlocksElement = (blocks) => blocks.map((block, index) => (
    <button
      type="button"
      key={block.actKey || index - 2}
      data-id={block.actKey}
      onTouchStart={block.actKey ? handleTouchStart : null}
      onTouchEnd={block.actKey ? handleTouchEnd : null}
      onClick={block.actKey ? null : () => handleOpenView('add', index - 2)}
    >
      {
        block.actKey
          ? (
            <>
              { (showRemoveButton && block.actKey[0] !== 'Z') && (
              <span className="removeButton" onClick={() => handleClickRemoveBlock(block.actKey)}><RemoveIcon /></span>
              ) }
              {/* Bug Fix index 可能不包含在 blockBackgroundGenerator */}
              <img src={blockBackgroundGenerator(index)} alt="block" />
              {/* TODO 目前 block.actKey 與 favIconGenerator 內的 case 對應不上 */}
              {favIconGenerator(block.actKey)}
              {block.name}
            </>
          )
          : <img src={block} alt="empty" />
      }
    </button>
  ));

  // 排列已選的最愛功能項目，空欄位補上空白區塊
  const renderBlocks = (list) => {
    const blocks = [];
    list.forEach((block) => {
      const position = parseInt(block.position, 10);
      // position + 2 -> 前 2 個是固定的、不可更動，從陣列第三筆開始排序
      if (position < 0) blocks.push(block);
      if (position >= 0) blocks[position + 2] = block;
    });
    for (let i = 0; i < 12; i++) {
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
        { customFavoriteList.length ? renderBlocks(customFavoriteList) : null }
      </div>
    </div>
  );

  const drawerController = (content) => {
    switch (content) {
      case 'add':
        return <Favorite1 blockOrder={blockOrder} updateFavoriteList={updateFavoriteList} />;
      case 'edit':
        return <Favorite2New updateFavoriteList={updateFavoriteList} />;
      default:
        return defaultContent();
    }
  };

  useEffect(() => {
    updateFavoriteList();
  }, []);

  return (
    <BottomDrawer
      noScrollable
      title={favoriteDrawer?.title}
      // isOpen={favoriteDrawer?.open}
      isOpen
      onClose={handleCloseDrawer}
      onBack={favoriteDrawer?.back}
      content={(
        <FavoriteDrawerWrapper>
          { drawerController(favoriteDrawer?.content) }
        </FavoriteDrawerWrapper>
      )}
    />
  );
};

export default Favorite;
