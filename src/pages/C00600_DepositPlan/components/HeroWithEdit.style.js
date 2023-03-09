import styled from 'styled-components';

const HeroWithEditWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background.lightBlue};
  height: 252px;

  .mt-16 {
    margin-top: 3rem;
  }

  .text-select {
    font-size: 2rem;
    color: ${({ theme }) => theme.colors.text.light};
  }

  .toolkits {
    position: relative;
    height: 252px;
    width: 100%;

    .group {
      position: absolute;
      left: 95%;
      top: 95%;
      transform: translate(-95%, -95%);
      z-index: 10;
    }
  }

  img {
    object-fit: cover;
    object-position: center;
    height: 252px;
    width: 100%;
  }
`;

export default HeroWithEditWrapper;
