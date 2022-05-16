import styled from 'styled-components';

const HeroSlideWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.3rem;

  .toolkits {
    position: relative;
    height: 252px;
    width: 100%;
    margin-bottom: 0.7rem;
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
`;

export default HeroSlideWrapper;
