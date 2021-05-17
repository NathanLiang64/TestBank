import styled from 'styled-components';

const HeaderWrapper = styled.header`
  height: 5.6rem;
  box-shadow: 0 .2rem .4rem rgba(0, 0, 0, .04);
  
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
    font-weight: bold;
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
