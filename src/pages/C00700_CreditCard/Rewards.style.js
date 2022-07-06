import styled from 'styled-components';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  padding-bottom: 6rem;

  .table {
    margin-top: 3rem;

    th {
      color: ${({ theme }) => theme.colors.primary.light};
      text-align: left;
      font-size: 1.2rem;
    }

    tr > *:nth-child(2){
      text-align: right;
    }

    td {
      height: 4.5rem;
      font-size: 1.6rem;
    }

    tr > td:nth-child(2){
      font-size: 1.8rem;
    }

    .w-1/4 { width: 25%; }
    .w-3/4 { width: 75%; }

    tbody > tr {
      border: 0;
    }
  }

  hr {
    border: none;
    border-top: 1px solid ${({ theme }) => theme.colors.border.lightest};
    width: 100%;
  }

  .font-14 {
    font-size: 1.4rem;
    color: ${({ theme }) => theme.colors.text.light};
  }

  .mb-6 {
    margin-bottom: 3rem;
  }
`;

export default PageWrapper;
