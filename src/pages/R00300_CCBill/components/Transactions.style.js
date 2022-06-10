import styled from 'styled-components';

const TransactionWrapper = styled.div`
  .info-tape-wrapper {
    padding: 1px 1.6rem 1.2rem 1.6rem;
    margin: -1px -1.6rem 1rem -1.6rem;
    max-height: 39rem;
    overflow-y: auto;
    scroll-snap-type: y mandatory;
    scroll-padding-top: -0.4rem;

    & > * {
      scroll-snap-align: start;
    }
  }

  .toolbar {
    display: flex;
    justify-content: end;
    width: 100%;
  }

  .btn-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.4rem;
    width: fit-content;
  }
`;

export default TransactionWrapper;
