import styled from 'styled-components';

const DepositPlanWrapper = styled.div`
  margin-bottom: 3.3rem;

  .pad {
    display: grid;
    align-content: flex-start;
    justify-items: center;
    grid-gap: 1.2rem;
    width: 100%;
    padding: 0 1.6rem 1.7rem;
  }

  .flex {
    align-items: center;
    color: ${({ theme }) => theme.colors.text.lightGray};
    font-size: 1.4rem;
  }

  .object-contain {
    object-fit: contain;
  }

  em {
    color: ${({ theme }) => theme.colors.primary.dark};
  }

  .mt-3 {
    margin-top: 3.3rem;
  }

  hr {
    border-color: ${({ theme }) => theme.colors.border.lightest};
    margin: 2rem 0;
    width: 100%;
    border-width: 0.5px;
  }
`;

export default DepositPlanWrapper;
