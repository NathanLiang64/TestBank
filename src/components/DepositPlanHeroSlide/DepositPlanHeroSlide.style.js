import styled from 'styled-components';

const DepositPlanHeroSlideWrapper = styled.div`
  display: grid;
  align-content: flex-start;
  justify-items: center;
  grid-gap: 0.3rem;
  ${({ $shouldExtend }) => $shouldExtend && `
    margin-bottom: -3rem;
    z-index: 0;
  `}

  .toolkits {
    position: relative;
    height: 252px;
    width: 100%;
    margin-bottom: 0.7rem;

    .overlay {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0 3.2rem;
      z-index: 10;
      background-image: linear-gradient(180deg, rgb(172 141 232 / 0.74) 0%, rgb(93 47 179 / 0.74) 100%);
      color: ${({ theme }) => theme.colors.basic.white};
    }

    .group {
      position: absolute;
      left: 95%;
      top: 95%;
      transform: translate(-95%, -95%);
      display: grid;
      align-content: flex-start;
      grid-gap: 1.2rem;
      z-index: 10;
    }
  }

  img {
    object-fit: cover;
    object-position: center;
    height: 252px;
    width: 100%;
  }

  .title {
    font-size: 2.4rem;
    font-weight: 500;
    text-align: center;
  }

  .account {
    font-size: 1.6rem;
    line-height: 1.6rem;
    font-weight: 500;
    text-align: center;
    color: ${({ theme }) => theme.colors.text.lightGray};
  }

  .balance {
    align-self: flex-end;
    font-size: 3rem;
    font-weight: 500;
  }
`;

export default DepositPlanHeroSlideWrapper;
