import styled from 'styled-components';
import Layout from 'components/Layout';
// import theme from 'themes/theme';

const RegularPwdModifyWrapper = styled(Layout)`
  z-index: 1001;
  height: 100%;
  background: ${({ theme }) => theme.colors.basic.white};
`;

export default RegularPwdModifyWrapper;
