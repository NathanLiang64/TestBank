import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowBack, Home } from '@material-ui/icons';
import { FEIBIconButton } from 'components/elements';
import theme from 'themes/theme';
import HeaderWrapper from './header.style';
import { setTitle } from './stores/actions';

const Header = () => {
  const title = useSelector(({ header }) => header.title);

  const dispatch = useDispatch();
  useEffect(() => {
    // TODO: 應 call api 取得頁面標題
    const newTitle = 'Page Title';
    dispatch(setTitle(newTitle));
  }, []);

  return (
    <HeaderWrapper>
      <FEIBIconButton
        className="goBack"
        $fontSize={2.4}
        $iconColor={theme.colors.primary.brand}
      >
        <ArrowBack />
      </FEIBIconButton>
      <h2>{title}</h2>
      <FEIBIconButton
        className="goHome"
        $fontSize={2.4}
        $iconColor={theme.colors.primary.brand}
      >
        <Home />
      </FEIBIconButton>
    </HeaderWrapper>
  );
};

export default Header;
