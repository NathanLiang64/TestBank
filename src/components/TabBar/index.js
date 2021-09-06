import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { logout } from 'apis/authApi';

import TransferImage from 'assets/images/tabBarIcons/transfer.svg';
import NoticeImage from 'assets/images/tabBarIcons/notice.svg';
import FavoriteImage from 'assets/images/tabBarIcons/favorite.svg';
import PromoCodeImage from 'assets/images/tabBarIcons/promoCode.svg';
import MoreImage from 'assets/images/tabBarIcons/more.svg';
import DiscountImage from 'assets/images/tabBarIcons/discount.svg';
import QRCodeImage from 'assets/images/tabBarIcons/qrCode.svg';
import CardLessATMImage from 'assets/images/tabBarIcons/cardlessATM.svg';
import ArrowImage from 'assets/images/tabBarIcons/arrow.svg';
import AvatarImage from 'assets/images/tabBarIcons/Navigation_member.png';
import { setDrawerContent, setOpenFavoriteDrawer } from 'pages/Favorite/stores/actions';
import TabBarWrapper from './tabBar.style';

const TabBar = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const tabButtonList = [
    {
      id: 0,
      label: '轉帳',
      img: TransferImage,
      route: '/transfer',
    },
    {
      id: 1,
      label: '通知',
      img: NoticeImage,
      route: '/notice',
    },
    {
      id: 2,
      label: '最愛',
      img: FavoriteImage,
      route: 'favorite',
    },
    {
      id: 3,
      label: '推薦碼分享',
      img: PromoCodeImage,
      route: '',
    },
    {
      id: 4,
      label: '更多',
      img: MoreImage,
      route: '/more',
    },
    {
      id: 5,
      label: '優惠',
      img: DiscountImage,
      route: '',
    },
    {
      id: 6,
      label: 'QR Code轉帳',
      img: QRCodeImage,
      route: '/QRCodeTransfer',
    },
    {
      id: 7,
      label: '無卡提款',
      img: CardLessATMImage,
      route: '/cardLessATM',
    },
    {
      id: 8,
      label: '登出',
      img: NoticeImage,
      route: 'logout',
    },
  ];

  const toPage = async (item) => {
    if (item.route === 'logout') {
      const logoutData = {
        channelCode: 'HHB_A',
        appVersion: '1.0.15',
        udid: '',
      };
      const logoutResponse = await logout(logoutData);
      if (!logoutResponse.message) {
        history.push('/login');
        localStorage.clear();
      } else {
        // eslint-disable-next-line no-alert
        alert(logoutResponse.message);
      }
      return;
    }
    if (item.route === 'favorite') {
      dispatch(setOpenFavoriteDrawer(true));
      dispatch(setDrawerContent(''));
      return;
    }
    if (item.route) {
      history.push(item.route);
    }
  };

  const renderButtons = () => tabButtonList.map((item) => (
    <div className="button-item" onClick={() => toPage(item)} key={item.id}>
      <svg width="20" height="20">
        <image xlinkHref={item.img} width="20" height="20" />
      </svg>
      <div className="label">{ item.label }</div>
    </div>
  ));

  return (
    <TabBarWrapper>
      <div className="buttons">
        { renderButtons() }
      </div>
      <div className="arrow-container">
        <svg width="8" height="12">
          <image xlinkHref={ArrowImage} width="8" height="12" />
        </svg>
      </div>
      <div className="avatar">
        <img src={AvatarImage} alt="" />
      </div>
    </TabBarWrapper>
  );
};

export default TabBar;
