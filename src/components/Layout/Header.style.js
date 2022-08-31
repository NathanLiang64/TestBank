import styled from 'styled-components';

const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4.4rem;
  padding: .4rem;
  background: ${({ $isTransparent, theme }) => ($isTransparent ? 'transparent' : theme.colors.basic.white)};
  z-index: 1000;
  
  .goBack,
  .goHome {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  
  h2 {
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 1.8rem;
    letter-spacing: .04rem;
    color: ${({ theme }) => theme.colors.text.dark};
    transform: translate(-50%, -50%);
  }
  
  .goHome {
    position: absolute;
    top: 50%;
    right: .8rem;
  }
  
  .Icon {
    font-size: 2.4rem;
    color: ${({ theme }) => theme.colors.text.dark};
  }
`;

export default HeaderWrapper;
