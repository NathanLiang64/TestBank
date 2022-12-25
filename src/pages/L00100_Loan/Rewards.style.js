import styled from 'styled-components';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  padding-bottom: 6rem;

  .text-red {
    color: ${({ theme }) => theme.colors.state.error};
  }

  .emptydata-wrapper {
    width: 100%;
    height: 30vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export default PageWrapper;
