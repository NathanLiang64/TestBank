import { FEIBIconButton } from 'components/elements';
// import { closeFunc } from 'utilities/BankeePlus';
import { ArrowBackIcon, HomeIcon } from 'assets/images/icons';
import theme from 'themes/theme';
import HeaderWrapper from './header.style';

const Header = ({ title, showBack = true, showHome = true }) => {
  const handleHomeIconClick = (className) => {
    if (className === 'goHome') {
      console.log('通知app回首頁');
    }
    if (className === 'goBack') {
      console.log('回前一頁');
    }
  };

  const renderIconButton = (className, icon) => (
    <FEIBIconButton
      className={className}
      $fontSize={2.4}
      $iconColor={theme.colors.text.dark}
      onClick={() => handleHomeIconClick(className)}
    >
      {icon}
    </FEIBIconButton>
  );

  return (
    <HeaderWrapper>
      { showBack && renderIconButton('goBack', <ArrowBackIcon />) }
      <h2>{title}</h2>
      { showHome && renderIconButton('goHome', <HomeIcon />) }
    </HeaderWrapper>
  );
};

export default Header;
