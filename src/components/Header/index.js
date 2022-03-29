import { FEIBIconButton } from 'components/elements';
import { closeFunc, goAppHome } from 'utilities/BankeePlus';
import { ArrowBackIcon, HomeIcon } from 'assets/images/icons';
import theme from 'themes/theme';
import HeaderWrapper from './header.style';

const Header = ({
  title, hideBack, hideHome, goBack,
}) => {
  const handleHomeIconClick = (className) => {
    if (className === 'goHome') {
      goAppHome();
    } else if (className === 'goBack') {
      if (goBack) {
        goBack();
      } else closeFunc();
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
      { !hideBack && renderIconButton('goBack', <ArrowBackIcon />) }
      <h2>{title}</h2>
      { !hideHome && renderIconButton('goHome', <HomeIcon />) }
    </HeaderWrapper>
  );
};

export default Header;
