import styled from 'styled-components';
import Layout from 'components/Layout';

const MoreWrapper = styled(Layout)`
  top: 2.4rem;
  padding: 0;
  height: calc(100% - 8.4rem);  // top 2.4 + bottomTabBar 6
  overflow: hidden;

  .MuiTabs-root {
    margin: 0 1.6rem 2.4rem 1.6rem;
  }
  
  .MuiTab-root {
    padding: 0 .8rem;
  }

  .mainContent {
    padding: 0 1.6rem;
    height: calc(100% - 6rem);
    overflow-y: auto;

    section {
      padding-top: 3.2rem;
      padding-bottom: 2.4rem;

      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: -1.6rem;
        display: block;
        width: 100vw;
        height: .8rem;
        background: ${({ theme }) => theme.colors.background.lighterBlue};
      }

      .title {
        margin-bottom: 1.2rem;
        font-weight: 500;
        text-align: center;
      }

      .blockGroup {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: .8rem;

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
  }
`;

export default MoreWrapper;
