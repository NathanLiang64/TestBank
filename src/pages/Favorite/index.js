import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { EditRounded, RemoveRounded } from '@material-ui/icons';
import BottomDrawer from 'components/BottomDrawer';
import { getCustomFavoriteList } from 'apis/favoriteApi';
import BlockEmpty from 'assets/images/favoriteBlock/blockEmpty.png';
import Favorite1 from './favorite_1';
import { setDrawerContent, setOpenFavoriteDrawer } from './stores/actions';
import { blockBackgroundGenerator, iconGenerator } from './favoriteGenerator';
import FavoriteDrawerWrapper from './favorite.style';

const Favorite = () => {
  const [favoriteList, setFavoriteList] = useState(null);
  const [pressTimer, setPressTimer] = useState(0);
  const [blockAmount, setBlockAmount] = useState(0);
  const [showRemoveButton, setShowRemoveButton] = useState(false);
  const openFavoriteDrawer = useSelector(({ favorite }) => favorite.openFavoriteDrawer);
  const drawerContent = useSelector(({ favorite }) => favorite.drawerContent);
  const dispatch = useDispatch();

  const handleCloseDrawer = () => {
    setShowRemoveButton(false);
    dispatch(setOpenFavoriteDrawer(false));
  };

  const handleOpenEditView = () => {
    // console.log('開啟編輯畫面');
  };

  const handleClickRemoveBlock = (event) => {
    const blockId = event.currentTarget.parentElement.getAttribute('data-id');
    const filteredFavoriteList = favoriteList.filter((block) => block.id !== blockId);
    setFavoriteList(filteredFavoriteList);
  };

  const handleEditBlock = () => setShowRemoveButton(true);
  const handleClickAddBlock = () => dispatch(setDrawerContent('add'));
  const handleTouchStart = () => setPressTimer(setTimeout(handleEditBlock, 500));
  const handleTouchEnd = () => pressTimer && clearTimeout(pressTimer);

  /* eslint-disable react/no-array-index-key */
  const renderEmptyBlocks = (length) => {
    const emptyBlocks = [];
    for (let i = 0; i < length; i++) {
      emptyBlocks.push(BlockEmpty);
    }
    return emptyBlocks.map((item, index) => (
      <button type="button" key={index} onClick={handleClickAddBlock}>
        <img src={BlockEmpty} alt="empty" />
      </button>
    ));
  };

  // render 已設置的最愛項目，最愛項目總數為 6，前 2 項為預設存在 (不可編輯)，背景由 index + 3 開始渲染
  const renderFavoriteBlocks = (blocks) => blocks.map((item, index) => (
    <button type="button" key={item.id} data-id={item.id} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      { showRemoveButton && <span className="removeButton" onClick={handleClickRemoveBlock}><RemoveRounded /></span> }
      <img src={blockBackgroundGenerator(index + 3)} alt="block" />
      <span className="icon">
        {iconGenerator(item.icon)}
      </span>
      {item.label}
    </button>
  ));

  const defaultContent = () => (
    <div className="defaultPage">
      <button type="button" className="editButton" onClick={handleOpenEditView}>
        編輯
        <EditRounded />
      </button>

      <div className="favoriteArea" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <button type="button">
          <img src={blockBackgroundGenerator(1)} alt="block" />
          <span className="icon">{iconGenerator('share')}</span>
          推薦碼分享
        </button>
        <button type="button" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <img src={blockBackgroundGenerator(2)} alt="block" />
          <span className="icon">{iconGenerator('gift')}</span>
          優惠
        </button>
        { favoriteList && renderFavoriteBlocks(favoriteList) }
        { blockAmount > 0 && renderEmptyBlocks(blockAmount) }
      </div>
    </div>
  );

  const drawerController = (content) => {
    switch (content) {
      case 'add':
        return <Favorite1 />;
      default:
        return defaultContent();
    }
  };

  useEffect(() => {
    getCustomFavoriteList().then((response) => setFavoriteList(response.customFavoriteList));
  }, []);

  useEffect(() => {
    // 最愛項目總數為 6，前 2 項為預設存在 (不可編輯)，故取 4 項自訂最愛項目
    if (favoriteList) setBlockAmount(4 - favoriteList.length);
  }, [favoriteList, blockAmount]);

  return (
    <BottomDrawer
      title="我的最愛"
      isOpen={openFavoriteDrawer}
      onClose={handleCloseDrawer}
      content={(
        <FavoriteDrawerWrapper>
          { drawerController(drawerContent) }
        </FavoriteDrawerWrapper>
      )}
    />
  );
};

export default Favorite;
