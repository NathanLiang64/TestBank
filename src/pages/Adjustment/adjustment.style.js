import styled from 'styled-components';
import Layout from 'components/Layout';

const AdjustmentWrapper = styled(Layout)`
  .currentAmount {
    margin: 1rem 0;
    font-weight: bold;
  }
  .inputContainer {
    .tailText {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      font-size: 100%;
    }
    textarea {
      line-height: 1.6rem;
    }
    .datePickerContainer {
      display: flex;
      justify-content: space-between;
      span {
        margin: 0 1rem;
      }
    }
  }
  .addCertification {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    span {
      margin-left: 0.5rem;
    }
  }
  .countDownCard {
    width: 100vw;
    background: #F3F5FC;
    padding: 1.2rem 1.6rem;
    transform: translateX(-1.6rem);
    margin-bottom: 2.4rem;
    position: relative;
    .countDownLabel {
      color: ${({ theme }) => theme.colors.text.darkGray};
    }
    .countDownInfo {
      display: flex;
      justify-content: space-between;
      .getNewOTP {
        width: 15rem;
        min-height: 2rem;
      }
    }
  }
  .countSec {
    font-size: 3rem;
    color: #F47A66;
  }
`;

export default AdjustmentWrapper;
