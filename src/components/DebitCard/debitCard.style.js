import styled from 'styled-components';

const DebitCardWrapper = styled.div`
  margin-bottom: 2rem;
  padding: 1.2rem;
  border-radius: .8rem;
  background: ${({ theme }) => theme.colors.card.purple};

  .cardTitle {
    .cardName {
      color: ${({ theme }) => theme.colors.text.darkGray};
    }
    .account {
      font-size: 1.4rem;
      font-weight: bold;
      color: ${({ theme }) => theme.colors.text.darkGray};
    }
  }

  .cardBalance {
    display: flex;
    justify-content: flex-end;
    align-items: baseline;

    .balance {
      font-size: 2.4rem;
      font-weight: bold;
    }
  }
`;

export default DebitCardWrapper;
