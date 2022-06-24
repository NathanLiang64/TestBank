import styled from 'styled-components';

const PageWrapper = styled.div`
  padding-block: 4.4rem;

  .bg-gray {
    background-color: ${({ theme }) => theme.colors.background.lighterBlue};
    padding: 1.6rem;
    padding-block-end: 4.6rem;
  }

  .txn-wrapper {
    background-color: ${({ theme }) => theme.colors.basic.white};
    padding-inline: 1.6rem;
    margin-block-start: -3rem;
    padding-block-start: 3rem;
    border-top-left-radius: 3rem;
    border-top-right-radius: 3rem;
  }

  .note {
    font-size: 1.4rem;
    color: ${({ theme }) => theme.colors.text.light};
    margin-block-start: 1.6rem;
    margin-inline: 1.6rem;
  }

  .loader {
    height: 9.2rem;
  }
`;

export default PageWrapper;
