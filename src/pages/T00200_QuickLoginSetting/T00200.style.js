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
  .bindingInfo {
    padding-top: 2rem;
    h1 {
      font-weight: bold;
      font-size: 1.8rem;
      margin-left: 0.6rem;
    }
  }
  .agreeTip {
    padding: 0 1.6rem;
    margin-top: 2.4rem;
    margin-bottom: 1.6rem;
    
    p {
      font-size: 1.2rem;
      color: ${({ theme }) => theme.colors.text.light};
    }
  }
`;

export default QuickLoginSettingWrapper;
