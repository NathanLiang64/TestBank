import styled from 'styled-components';

const TutorialsWrapper = styled.div`
  position: fixed;
  z-index: 1001;
  .skip {
    position: absolute;
    top: 0;
    right: 0;
    width: 70px;
    height: 60px;
    z-index: 1002;
  }
  img {
    width: 100vw;
    height: 100vh;
  }
`;

export default TutorialsWrapper;
