import styled from 'styled-components';

const DepositePlanWrapper = styled.div`
  margin-block-end: 3.3rem;

  .pad {
    padding-inline: 1.6rem;
  }

  .flex {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    align-items: center;
    color: ${({ theme }) => theme.colors.text.lightGray};
    font-size: 1.4rem;
    width: 100%;
    padding-block-end: 1.7rem;
  }

  em {
    color: ${({ theme }) => theme.colors.primary.dark};
  }

  .mt-3 {
    margin-block-start: 3.3rem;
  }

  hr {
    border-color: ${({ theme }) => theme.colors.background.lighter};
    margin-block: 1.6rem;
  }
`;

export default DepositePlanWrapper;
