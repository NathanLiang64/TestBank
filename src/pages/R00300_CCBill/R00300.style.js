import styled from 'styled-components';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;

  .cal {
    display: flex;
    color: ${({ theme }) => theme.colors.text.light};
    margin-inline: 4rem;
    min-height: 4.6rem;

    .auto {
      flex: 1 1 100%;
    }
  }

  .badMargin {
    margin-block-end: -2.4rem;
  }
`;

const DownloadDrawerWrapper = styled.ul`
  button {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .Icon {
    margin-right: 0 !important;
  }
`;

export default PageWrapper;
export { DownloadDrawerWrapper };
