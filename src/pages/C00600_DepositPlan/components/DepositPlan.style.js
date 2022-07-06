import styled from 'styled-components';

const DepositPlanWrapper = styled.div`
  margin-block-end: 3.3rem;

  .pad {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    width: 100%;
    padding-inline: 1.6rem;
    padding-block-end: 1.7rem;
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
    margin-block-start: 3.3rem;
  }

  hr {
    border-color: ${({ theme }) => theme.colors.border.lightest};
    margin-block: 2rem;
    width: 100%;
  }
`;

export default DepositPlanWrapper;
