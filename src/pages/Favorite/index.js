import { useSelector, useDispatch } from 'react-redux';
import { EditRounded } from '@material-ui/icons';
import BottomDrawer from 'components/BottomDrawer';
import {
  ShareIcon, GiftIcon, ApplyCreditCardIcon, CardLessIcon, EBankIcon, QRCodeTransferIcon,
} from 'assets/images/icons';
import FavoriteDrawerWrapper from './favorite.style';
import { setOpenFavoriteDrawer } from './stores/actions';

const Favorite = () => {
  const openFavoriteDrawer = useSelector(({ favorite }) => favorite.openFavoriteDrawer);
  const dispatch = useDispatch();

  const list = [
    {
      id: '1',
      label: '推薦碼分享',
      icon: <ShareIcon />,
      route: '',
    },
    {
      id: '2',
      label: '優惠',
      icon: <GiftIcon />,
      route: '',
    },
    {
      id: '3',
      label: '申請信用卡',
      icon: <ApplyCreditCardIcon />,
      route: '',
    },
    {
      id: '4',
      label: '無卡提款',
      icon: <CardLessIcon />,
      route: '',
    },
    {
      id: '5',
      label: '數存會員升級(立即驗)',
      icon: <EBankIcon />,
      route: '',
    },
    {
      id: '6',
      label: 'QR CODE轉帳',
      icon: <QRCodeTransferIcon />,
      route: '/financialDepartments',
    },
  ];

  return (
    <BottomDrawer
      title="我的最愛"
      isOpen={openFavoriteDrawer}
      onClose={() => dispatch(setOpenFavoriteDrawer(false))}
      content={(
        <FavoriteDrawerWrapper>
          <button type="button" className="editButton">
            編輯
            <EditRounded />
          </button>

          <div className="favoriteArea">
            { list.map((item) => (
              <button type="button" key={item.id}>
                <span className="icon">
                  {item.icon}
                </span>
                {item.label}
              </button>
            )) }
          </div>
        </FavoriteDrawerWrapper>
      )}
    />
  );
};

export default Favorite;
