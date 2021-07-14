import styled from 'styled-components';
import Layout from 'components/Layout';

const MoreWrapper = styled(Layout)`
  scroll-behavior: smooth;
  padding-top: 7.2rem;
  .tabContainer {
    width: 100vw;
    transform: translate(-1.6rem, -7.2rem);
    position: fixed;
    background: ${({ theme }) => theme.colors.basic.white};
    z-index: 1000;
    padding-left: 1.6rem;
    overflow: hidden;
    .MuiTabs-root {
      padding-right: 1.6rem;
    }
  }

  .contentContainer {
    padding-bottom: 3.2rem;
    &:before {
      left: 0;
      position: absolute;
      content: '';
      width: 100vw;
      height: .8rem;
      background: ${({ theme }) => theme.colors.background.lighterBlue};
      transform: translateX(-1.6rem);
    }
    .title {
      text-align: center;
      padding: 3.2rem 0 2.4rem;
      font-weight: 500;
    }
    .content {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-column-gap: 1.5rem;
      grid-row-gap: 4rem;

      .iconButton {
        display: flex;
        flex-direction: column;

        svg {
          margin: 0 auto .8rem;
        }

        span {
          text-align: center
        }
      }
    }
  }
`;

export default MoreWrapper;
