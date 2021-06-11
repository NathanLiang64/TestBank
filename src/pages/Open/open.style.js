import styled from 'styled-components';
import Layout from 'components/Layout';

const OpenWrapper = styled(Layout)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .btns-container {
    width: 100%;
    margin: 3rem 0;
  }
  .logoContainer {
    width: 100%;
    margin-bottom: 3rem;
    img {
      width: 100%;
    }
  }
`;

export default OpenWrapper;
