import styled from 'styled-components';

const SwiperLayoutWrapper = styled.div`
  .swiper-container {
    padding-bottom: 3.3rem;
  }

  hr {
    border-color: ${({ theme }) => theme.colors.background.lighter};
    margin-block: 0.5rem;
  }
`;

export default SwiperLayoutWrapper;
