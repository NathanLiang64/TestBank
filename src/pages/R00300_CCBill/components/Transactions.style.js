import styled from 'styled-components';

const TransactionWrapper = styled.div`
  .toolbar {
    // display: flex;
    // justify-content: end;
    // width: 100%;
    width: fit-content;
    margin-left: auto;
  }

  .btn-icon {
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    align-items: center;
    font-size: 1.4rem;
    width: fit-content;
  }

  .emptydata-wrapper {
    width: 100%;
    height: 30vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export default TransactionWrapper;
