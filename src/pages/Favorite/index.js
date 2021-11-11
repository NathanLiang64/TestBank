/* eslint-disable */
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import BottomDrawer from 'components/BottomDrawer';
import { getFavoriteList, updateFavoriteItem } from 'apis/favoriteApi';
import BlockEmpty from 'assets/images/favoriteBlock/blockEmpty.png';
import { EditIcon, RemoveIcon } from 'assets/images/icons';
import Favorite1 from './favorite_1';
import Favorite2 from './favorite_2';
import { setFavoriteDrawer, setCustomFavoriteList } from './stores/actions';
import { blockBackgroundGenerator, favIconGenerator } from './favoriteGenerator';
import FavoriteDrawerWrapper from './favorite.style';

const Favorite = () => {
  const [pressTimer, setPressTimer] = useState(0);
  const [blockOrder, setBlockOrder] = useState(0);
  const [showRemoveButton, setShowRemoveButton] = useState(false);
  const favoriteDrawer = useSelector(({ favorite }) => favorite.favoriteDrawer);
  const customFavoriteList = useSelector(({ favorite }) => favorite.customFavoriteList);
  const dispatch = useDispatch();

  // 取得用戶我的最愛清單
  const updateFavoriteList = () => {
    getFavoriteList().then((response) => {
      console.log(response);
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
  const handleClickRemoveBlock = (key) => {
    const params = {
      actKey: key,
      position: null
    };
    // console.log(params);

    updateFavoriteItem(params)
      .then((response) => {
        console.log('刪除最愛 res', response);
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
          ? (<>
            { (showRemoveButton && block.actKey[0] !== 'Z') && (
              <span className="removeButton" onClick={() => handleClickRemoveBlock(block.actKey)}><RemoveIcon /></span>
            ) }
            <img src={blockBackgroundGenerator(index + 1)} alt="block" />
            {favIconGenerator(block.actKey)}
            {block.name}
          </>)
          : <img src={block} alt="empty" />
      }
    </button>
  ));

  // 排列已選的最愛功能項目，空欄位補上空白區塊
  const renderBlocks = () => {
    const blocks = [];
    customFavoriteList.forEach((block) => {
      const position = parseInt(block.position, 10);
      if (position < 0) blocks.push(block)
      // position + 2 -> 前 2 個是固定的、不可更動，從陣列第三筆開始排序
      blocks[position + 2] = block
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
        { renderBlocks() }
      </div>
    </div>
  );

  const drawerController = (content) => {
    switch (content) {
      case 'add':
        return <Favorite1 blockOrder={blockOrder} />;
      case 'edit':
        return <Favorite2 />;
      default:
        return defaultContent();
    }
  };

  useEffect(() => {
    updateFavoriteList();
  // dispatch(setFavoriteList(mockFavoriteList.favoriteList));
  }, []);

  // useEffect(() => {
  //   const customList = [];
  //   favoriteList?.forEach((group) => group.blocks.forEach((item) => item.selected && customList.push(item)));
  //   dispatch(setCustomFavoriteList(customList));
  // const selectedBlocks = favoriteList
  //   .map((group) => group.blocks.filter((block) => block.selected))
  //   .flat();
  // setSelectedFavoriteList(selectedBlocks);
  // }, [favoriteList?.length]);

  // const test = () => {
  //   const params = {
  //     actKey: 'A03',
  //     position: "4"
  //   };
  //   updateFavoriteItem(params)
  //     .then((res) => console.log('編輯最愛 res', res))
  //     .catch((err) => console.log('編輯最愛 err', err))
  // }

  return (
    <BottomDrawer
      noScrollable
      title={favoriteDrawer?.title}
      isOpen={favoriteDrawer?.open}
      onClose={handleCloseDrawer}
      onBack={favoriteDrawer?.back}
      content={(
        <FavoriteDrawerWrapper>
          {/*<button type="button" onClick={test}>測試</button>*/}
          { drawerController(favoriteDrawer?.content) }
        </FavoriteDrawerWrapper>
      )}
    />
  );
};

export default Favorite;
