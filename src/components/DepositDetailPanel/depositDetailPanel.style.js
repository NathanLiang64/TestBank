import styled from 'styled-components';

const DepositDetailPanelWrapper = styled.div`
  margin: 0 1rem;

  .transactionDetail {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    flex-grow: 1;
    margin-bottom: 1.6rem;

    .moreButton {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      margin-top: .4rem;
      font-size: 1.4rem;
      letter-spacing: .1rem;
      
      .Icon {
        top: -.2rem;
        margin-left: .2rem;
        font-size: 1.6rem;
      }
    }
  }
`;

export default DepositDetailPanelWrapper;
