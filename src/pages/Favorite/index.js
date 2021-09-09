import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { EditRounded, RemoveRounded } from '@material-ui/icons';
import BottomDrawer from 'components/BottomDrawer';
import { getFavoriteList } from 'apis/favoriteApi';
import BlockEmpty from 'assets/images/favoriteBlock/blockEmpty.png';
import Favorite1 from './favorite_1';
import Favorite2 from './favorite_2';
import { setFavoriteDrawer, setFavoriteList, setCustomFavoriteList } from './stores/actions';
import { blockBackgroundGenerator, iconGenerator } from './favoriteGenerator';
import FavoriteDrawerWrapper from './favorite.style';

const Favorite = () => {
  const [pressTimer, setPressTimer] = useState(0);
  const [blockAmount, setBlockAmount] = useState(0);
  const [showRemoveButton, setShowRemoveButton] = useState(false);
  const favoriteDrawer = useSelector(({ favorite }) => favorite.favoriteDrawer);
  const favoriteList = useSelector(({ favorite }) => favorite.favoriteList);
  const customFavoriteList = useSelector(({ favorite }) => favorite.customFavoriteList);
  const dispatch = useDispatch();

  const handleCloseDrawer = () => {
    setShowRemoveButton(false);
    dispatch(setFavoriteDrawer({ ...favoriteDrawer, open: false }));
  };

  const handleOpenView = (viewName) => {
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

  const handleClickRemoveBlock = (event) => {
    const blockId = event.currentTarget.parentElement.getAttribute('data-id');

    // update favoriteList
    const filteredFavoriteList = favoriteList;
    filteredFavoriteList.forEach((group) => group.blocks.forEach((item) => {
      if (item.id === blockId) item.selected = !item.selected;
    }));
    dispatch(setFavoriteList(filteredFavoriteList));

    // update customFavoriteList
    const filteredCustomFavoriteList = customFavoriteList.filter((block) => block.id !== blockId);
    dispatch(setCustomFavoriteList(filteredCustomFavoriteList));
  };

  const handleEditBlock = () => setShowRemoveButton(true);
  const handleTouchStart = () => setPressTimer(setTimeout(handleEditBlock, 800));
  const handleTouchEnd = () => pressTimer && clearTimeout(pressTimer);

  /* eslint-disable react/no-array-index-key */
  const renderEmptyBlocks = (length) => {
    const emptyBlocks = [];
    for (let i = 0; i < length; i++) {
      emptyBlocks.push(BlockEmpty);
    }
    return emptyBlocks.map((item, index) => (
      <button type="button" key={index} onClick={() => handleOpenView('add')}>
        <img src={BlockEmpty} alt="empty" />
      </button>
    ));
  };

  // 已設置的最愛項目 - 最愛項目總數為 12，前 2 項為預設存在 (不可編輯)，背景由 index + 3 開始渲染
  const renderFavoriteBlocks = (blocks) => blocks.map((item, index) => (
    <button type="button" key={item.id} data-id={item.id} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      { showRemoveButton && <span className="removeButton" onClick={handleClickRemoveBlock}><RemoveRounded /></span> }
      <img src={blockBackgroundGenerator(index + 3)} alt="block" />
      <span className="icon">
        {iconGenerator(item.id)}
      </span>
      {item.label}
    </button>
  ));

  // 預設的彈窗頁面 - 已設置的最愛項目
  const defaultContent = () => (
    <div className="defaultPage">
      <button type="button" className="editButton" onClick={() => handleOpenView('edit')}>
        編輯
        <EditRounded />
      </button>

      <div className="favoriteArea">
        <button type="button" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <img src={blockBackgroundGenerator(1)} alt="block" />
          <span className="icon">{iconGenerator('share')}</span>
          推薦碼分享
        </button>
        <button type="button" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <img src={blockBackgroundGenerator(2)} alt="block" />
          <span className="icon">{iconGenerator('gift')}</span>
          優惠
        </button>
        { renderFavoriteBlocks(customFavoriteList) }
        { blockAmount > 0 && renderEmptyBlocks(blockAmount) }
      </div>
    </div>
  );

  const drawerController = (content) => {
    switch (content) {
      case 'add':
        return <Favorite1 />;
      case 'edit':
        return <Favorite2 />;
      default:
        return defaultContent();
    }
  };

  useEffect(() => {
    getFavoriteList().then((response) => dispatch(setFavoriteList(response.favoriteList)));
  }, []);

  useEffect(() => {
    const customList = [];
    favoriteList?.forEach((group) => group.blocks.forEach((item) => item.selected && customList.push(item)));
    dispatch(setCustomFavoriteList(customList));
    // const selectedBlocks = favoriteList
    //   .map((group) => group.blocks.filter((block) => block.selected))
    //   .flat();
    // setSelectedFavoriteList(selectedBlocks);
  }, [favoriteList?.length]);

  useEffect(() => {
    // 最愛項目總數為 12，前 2 項為預設存在 (不可編輯)，故取 4 項自訂最愛項目
    setBlockAmount(10 - customFavoriteList.length);
  }, [customFavoriteList.length]);

  return (
    <BottomDrawer
      noScrollable
      title={favoriteDrawer.title}
      isOpen={favoriteDrawer.open}
      onClose={handleCloseDrawer}
      onBack={favoriteDrawer.back}
      content={(
        <FavoriteDrawerWrapper>
          { drawerController(favoriteDrawer.content) }
        </FavoriteDrawerWrapper>
      )}
    />
  );
};

export default Favorite;
