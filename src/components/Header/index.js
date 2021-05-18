import { ArrowBack, Home } from '@material-ui/icons';
import { FEIBIconButton } from 'components/elements';
import theme from 'themes/theme';
import HeaderWrapper from './header.style';

const Header = () => (
  <HeaderWrapper>
    <FEIBIconButton
      className="goBack"
      $fontSize={2.4}
      $iconColor={theme.colors.primary.brand}
    >
      <ArrowBack />
    </FEIBIconButton>
    <h2>頁面標題</h2>
    <FEIBIconButton
      className="goHome"
      $fontSize={2.4}
      $iconColor={theme.colors.primary.brand}
    >
      <Home />
    </FEIBIconButton>
  </HeaderWrapper>
);

export default Header;
