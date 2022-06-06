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
`;

export default SwiperLayoutWrapper;
