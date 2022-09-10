import styled from 'styled-components';

const AccountOverviewWrapper = styled.div`
  
  .userCardArea {
    ${({ $multipleCardsStyle }) => $multipleCardsStyle && (`
      // left: -1.6rem;
      width: 100vw;
    `)}

    .swiper-container {
      padding-bottom: 1.6rem;
    }

    .swiper-pagination {
      left: -.8rem;
    }

    .singleAccount {
      padding: 1rem 1.6rem;
    }
  }
`;

export default AccountOverviewWrapper;
