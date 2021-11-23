import styled from 'styled-components';

const TutorialsWrapper = styled.div`
  position: fixed;
  z-index: 1001;
  height: 100%;
  .skip {
    position: absolute;
    top: 0;
    right: 0;
    width: 70px;
    height: 60px;
    z-index: 1002;
    color: #fff;
    font-size: 16px;
    line-height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  img {
    width: 100vw;
    height: 100%;
  }
  img.tutorial1Content {
    width: 311px;
    height: 497px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`;

export default TutorialsWrapper;
