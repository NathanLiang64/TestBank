import styled from 'styled-components';

const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4.4rem;
  background: ${({ theme }) => theme.colors.basic.white};
  z-index: 1000;
  
  .goBack,
  .goHome,
  h2 {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  
  h2 {
    left: 50%;
    font-size: 1.8rem;
    font-weight: 300;
    letter-spacing: .04rem;
    color: ${({ theme }) => theme.colors.text.dark};
    transform: translate(-50%, -50%);
  }
  
  .goHome {
    position: absolute;
    top: 50%;
    right: 0;
  }
`;

export default HeaderWrapper;
