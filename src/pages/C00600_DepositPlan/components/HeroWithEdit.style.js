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
    margin-bottom: 0.7rem;

    .group {
      position: absolute;
      right: 1rem;
      bottom: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
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
