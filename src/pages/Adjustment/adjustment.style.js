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
      padding-top: 0.2rem;
    }
    &.hide {
      display: none;
    }
    .datePickerContainer {
      display: flex;
      justify-content: space-between;
    }
  }
  .customArea, .addCertification {
    transform: translateY(-2.4rem);
  }
  .addCertification {
    display: flex;
    align-items: center;
    span {
      margin-left: 0.5rem;
    }
  }
  .countSec {
    font-size: 5rem;
    font-weight: bold;
  }
`;

export default AdjustmentWrapper;
