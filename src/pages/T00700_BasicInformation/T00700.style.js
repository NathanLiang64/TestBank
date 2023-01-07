import styled from 'styled-components';
import Layout from 'components/Layout';

const BasicInformationWrapper = styled(Layout)`
  .selectContainer {
    display: grid;
    grid-auto-flow: column;
    grid-column-gap: 2rem;

    div {
      width: 100%;
      flex-grow: 1;
    }
  }
`;

export default BasicInformationWrapper;
