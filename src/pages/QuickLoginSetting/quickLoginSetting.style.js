import styled from 'styled-components';
import Layout from 'components/Layout';

const QuickLoginSettingWrapper = styled(Layout)`
  padding: 2.4rem 1.6rem;
  .tip {
    margin-bottom: 2.4rem;
    font-weight: 400;
    font-size: 1.4rem;
    line-height: 2.1rem;
    padding: 0 1.6rem;
  }
  .switchContainer {
    border-top: .1rem solid ${({ theme }) => theme.colors.text.placeholder};
    font-size: 1.8rem;
    line-height: 2.7rem;
    padding: 1.2rem 1.2rem;
    &:last-child {
      border-bottom: .1rem solid ${({ theme }) => theme.colors.text.placeholder};
    }
    label {
      width: 100%;
      padding: 0;
      margin: 0;
      left: 0;
    }
    .mainBlock {
      width: calc(100% + 2.4rem);
      margin-top: 2.4rem;
      padding: 2.2rem 1.6rem;
      border-radius: .6rem;
      transform: translateX(-1.2rem);
      display: flex;
      justify-content: space-between;
      .text {
        color: ${({ theme }) => theme.colors.text.lightGray};
        font-weight: 400;
        font-size: 1.6rem;
        line-height: 2.4rem;
      }
      svg {
        width: 2rem;
        height: 2rem;
        color: ${({ theme }) => theme.colors.primary.light};
      }
      &.hide {
        display: none;
      }
    }
  }
  .agreeTip {
    padding: 0 1.6rem;
    margin-top: 2.4rem;
    margin-bottom: 1.6rem;
  }
  .patternSetting {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    // background: rgba(172, 141, 232, 0.8);
    background: rgba(66,48,99,.6) !important;
    backdrop-filter: blur(.4rem);
    z-index: 1000;
    display: grid;
    place-items: center;
    &.hide {
      display: none;
    }

    .tip {
      color: white;
      font-size: 2rem;
      font-weight: 500;
      text-align: center;
    }

    .pointContainer {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      .point {
        width: 5.4rem;
        height: 5.4rem;
        border: .1rem solid white;
        border-radius: 2.7rem;
        margin: 2.2rem;
        position: relative;
        &::before {
          position: absolute;
          content: ' ';
          width: 1.4rem;
          height: 1.4rem;
          background: white;
          border-radius: .7rem;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
  }
`;

export default QuickLoginSettingWrapper;
