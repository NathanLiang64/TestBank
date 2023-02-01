import styled from 'styled-components';
import Layout from 'components/Layout';

const BasicInformationWrapper = styled(Layout)`
  form {
    display: grid;
    align-content: flex-start;
    grid-gap: 2rem;
  }

  .selectContainer {
    display: flex;
    gap: 1.8rem;
    div {
      flex-grow: 1;
    }
  }
`;

export default BasicInformationWrapper;
