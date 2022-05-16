import styled from 'styled-components';
import Layout from 'components/Layout';

const ForeignCurrencyPriceSettingWrapper = styled(Layout)`
  &.drawerContainer {
    margin-top: 0;
    padding: 0 1.6rem 2.4rem;
    height: auto;
    button {
      margin-top: 1.8rem;
    }
  }
  .groupContainer {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .updateTime {
    font-size: 1.2rem;
    font-weight: 400;
    line-height: 1.8rem;
    text-align: left;
    margin-bottom: 0;
    height: 0;
    color: ${({ theme }) => theme.colors.text.mediumGray} !important;
    transform: translateY(.3rem);
  }
`;

export default ForeignCurrencyPriceSettingWrapper;
