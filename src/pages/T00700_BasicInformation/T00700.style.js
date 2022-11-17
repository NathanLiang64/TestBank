import styled from 'styled-components';
import Layout from 'components/Layout';

const BasicInformationWrapper = styled(Layout)`
  .selectContainer {
    display: flex;
    div {
      width: 100%;
      flex-grow: 1;
      &:first-child {
        margin-right: 1rem;
      }
      &:last-child {
        margin-left: 1rem;
      }
    }
  }
`;

export default BasicInformationWrapper;
