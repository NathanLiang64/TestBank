import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { EditRounded, RemoveRounded } from '@material-ui/icons';
import BottomDrawer from 'components/BottomDrawer';
import {
  ShareIcon, GiftIcon, ApplyCreditCardIcon, CardLessIcon, EBankIcon,
  // QRCodeTransferIcon,
} from 'assets/images/icons';
import { getFavoriteList } from 'apis/favoriteApi';
import BlockEmpty from 'assets/images/favoriteBlock/blockEmpty.png';
import BlockPink from 'assets/images/favoriteBlock/blockPink.svg';
import BlockYellow from 'assets/images/favoriteBlock/blockYellow.svg';
import BlockBlue from 'assets/images/favoriteBlock/blockBlue.svg';
import BlockOrange from 'assets/images/favoriteBlock/blockOrange.svg';
import BlockGreen from 'assets/images/favoriteBlock/blockGreen.svg';
import BlockPurple from 'assets/images/favoriteBlock/blockPurple.svg';
import FavoriteDrawerWrapper from './favorite.style';
import { setOpenFavoriteDrawer } from './stores/actions';

const Favorite = () => {
  const [favoriteList, setFavoriteList] = useState(null);
  const [pressTimer, setPressTimer] = useState(0);
  const [blockAmount, setBlockAmount] = useState(0);
  const [showRemoveButton, setShowRemoveButton] = useState(false);
  const openFavoriteDrawer = useSelector(({ favorite }) => favorite.openFavoriteDrawer);
  const dispatch = useDispatch();

  const iconGenerator = (name) => {
    switch (name) {
      case 'share':
        return <ShareIcon />;
      case 'gift':
        return <GiftIcon />;
      case 'applyCreditCard':
        return <ApplyCreditCardIcon />;
      case 'cardLess':
        return <CardLessIcon />;
      case 'eBank':
        return <EBankIcon />;
      case 'QRCodeTransfer':
        return <EBankIcon />;
      default:
        return null;
    }
  };

  const blockBackgroundGenerator = (index) => {
    switch (index) {
      case 1:
        return BlockPink;
      case 2:
        return BlockYellow;
      case 3:
        return BlockBlue;
      case 4:
        return BlockOrange;
      case 5:
        return BlockGreen;
      case 6:
        return BlockPurple;
      default:
        return null;
    }
  };

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

  const handleClickAddBlock = () => {
    // console.log('新增最愛');
  };

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

  useEffect(() => {
    getFavoriteList().then((response) => setFavoriteList(response.favoriteList));
  }, []);

  useEffect(() => {
    if (favoriteList) setBlockAmount(6 - favoriteList.length);
  }, [favoriteList, blockAmount]);

  return (
    <BottomDrawer
      title="我的最愛"
      isOpen={openFavoriteDrawer}
      onClose={handleCloseDrawer}
      content={(
        <FavoriteDrawerWrapper>
          <button type="button" className="editButton" onClick={handleOpenEditView}>
            編輯
            <EditRounded />
          </button>

          <div className="favoriteArea">
            { favoriteList && favoriteList.map((item, index) => (
              <button type="button" key={item.id} data-id={item.id} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                { showRemoveButton && <span className="removeButton" onClick={handleClickRemoveBlock}><RemoveRounded /></span> }
                <img src={blockBackgroundGenerator(index + 1)} alt="block" />
                <span className="icon">
                  {iconGenerator(item.icon)}
                </span>
                {item.label}
              </button>
            )) }

            { blockAmount > 0 && renderEmptyBlocks(blockAmount) }
          </div>
        </FavoriteDrawerWrapper>
      )}
    />
  );
};

export default Favorite;
