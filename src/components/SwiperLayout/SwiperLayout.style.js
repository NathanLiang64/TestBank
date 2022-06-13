import styled from 'styled-components';

const SwiperLayoutWrapper = styled.div`
  .swiper-container {
    padding-bottom: 2.5rem;
  }

  .swiper-container-horizontal > .swiper-pagination-bullets {
    bottom: 2px;
  }

  hr {
    border-color: ${({ theme }) => theme.colors.border.lightest};
    margin-block: 0.5rem;
  }
  .nickName {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 3.2rem;

    span {
      color: ${({ theme }) => theme.colors.text.dark};
      font-size: 1.8rem;
      font-weight: 500;
    }

    svg {
      color: ${({ theme }) => theme.colors.primary.light};
      font-size: 2.13rem;
      margin-left: .8rem;
    }
  }
`;

export default SwiperLayoutWrapper;
