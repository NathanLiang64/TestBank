import styled from 'styled-components';

const SwiperLayoutWrapper = styled.div`
  .swiper-container {
    padding-bottom: 2.5rem;

    & .swiper-slide > div > canvas {
      margin: auto;
    }

    & .swiper-slide > div > .group {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .swiper-container-horizontal > .swiper-pagination-bullets {
    bottom: 2px;
  }

  hr {
    border-color: ${({ theme }) => theme.colors.border.lightest};
    margin-block: 0.5rem;
    border-width: 0.5px;
  }
`;

export default SwiperLayoutWrapper;
