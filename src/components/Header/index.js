import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { ArrowBack, Home } from '@material-ui/icons';
import { FEIBIconButton } from 'components/elements';
import { closeFunc } from 'utilities/BankeePlus';

import theme from 'themes/theme';
import HeaderWrapper from './header.style';

const Header = () => {
  const history = useHistory();
  const title = useSelector(({ header }) => header.title);
  const isHomePage = useSelector(({ header }) => header.isHomePage);

  const handleHomeIconClick = (className) => {
    if (className === 'goHome') {
      closeFunc('home');
    }
    if (className === 'goBack') {
      if (history.length <= 1) {
        closeFunc('back');
      } else {
        history.goBack();
      }
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
      { !isHomePage && renderIconButton('goBack', <ArrowBack />) }
      <h2>{title}</h2>
      { !isHomePage && renderIconButton('goHome', <Home />) }
    </HeaderWrapper>
  );
};

export default Header;
