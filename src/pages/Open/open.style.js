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
`;

export default OpenWrapper;
