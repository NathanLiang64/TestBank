import styled from 'styled-components';
import Layout from 'components/Layout';

const NetworkWrapper = styled(Layout)`
  .infoContainer {
    display: flex;
    flex-direction: column;
    padding-bottom: 2.4rem;

    .nickname {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 0.4rem;

      .name {
        color: ${({ theme }) => theme.colors.text.dark};
        font-size: 1.8rem;
        font-weight: 500;
      }

      .MuiIconButton-root {
        margin-left: -0.4rem;
      }
    }

    .level {
      color: ${({ theme }) => theme.colors.primary.dark};
      text-align: center;
    }
  }

  .contentCard {
    padding: 3.2rem 0 2.4rem;
    text-align: center;

    &:before {
      left: 0;
      position: absolute;
      content: '';
      width: 100vw;
      height: 0.8rem;
      background: ${({ theme }) => theme.colors.background.lighterBlue};
      transform: translate(-1.6rem, -3.2rem);
    }

    .Icon {
      top: -0.1rem;
      font-size: 1.6rem;
    }

    .title {
      margin-bottom: 2.4rem;
    }

    .subTitle {
      display: flex;
      justify-content: center;
      align-items: center;
      color: ${({ theme }) => theme.colors.text.lightGray};
      font-size: 1.4rem;
      margin-bottom: 0.8rem;
    }

    .essay {
      font-size: 1.4rem;
      line-height: 2.1rem;
      padding: 0 2rem;
      color: ${({ theme }) => theme.colors.text.light};
      margin-bottom: 2.4rem;

      span {
        word-break: break-all;
      }
      
      .MuiIconButton-root {
        position: absolute;
        top: -1rem;
        right: -1rem;
      }
    }

    .mainBlock {
      flex-direction: column;
      margin-bottom: 2.4rem;

      .code {
        color: ${({ theme }) => theme.colors.primary.dark};
        font-size: 3rem;
        display: flex;
        font-weight: 500;

        button {
          padding: 0 0 0 0.3rem;
          transform: translateY(-0.2rem);

          svg {
            color: ${({ theme }) => theme.colors.primary.dark};
          }
        }
      }
    }

    .search {
      position: absolute;
      font-weight: 400;
      top: 0.1rem;
      right: 0;
      font-size: 1.4rem;
      display: flex;
      align-items: center;
      transform: translateY(-0.5rem);
    }

    .overviewContent {
      display: grid;
      grid-template-columns: repeat(3, 1fr);

      &.twoColumn {
        grid-template-columns: repeat(2, 1fr);
      }

      .num {
        font-size: 2rem;
        color: ${({ theme }) => theme.colors.primary.light};
        font-weight: 400;
      }
    }
  }
`;

const EssayWrapper = styled.form`
  padding-bottom: 2.4rem;
  
  #essay {
    margin-top: .8rem;
  }
  
  .limitText {
    display: block;
    text-align: right;
    font-size: 1.2rem;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.text.dark};
    
    &.warningColor {
      color: ${({ theme }) => theme.colors.state.danger};
    }
  }
`;

export default NetworkWrapper;
export { EssayWrapper };
