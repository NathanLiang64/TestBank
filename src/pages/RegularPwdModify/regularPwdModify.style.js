import styled from 'styled-components';
import Layout from 'components/Layout';
import theme from 'themes/theme';

const RegularPwdModifyWrapper = styled(Layout)`
  .point {
    color: ${theme.colors.text.light};
    margin-bottom: 2rem;
    font-size: 1rem;
  }
`;

export default RegularPwdModifyWrapper;
