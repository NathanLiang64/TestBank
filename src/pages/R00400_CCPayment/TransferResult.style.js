import styled from 'styled-components';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;

  .mb-2 {
    margin-block-end: 1rem;
  }

  .deduct {
    background-color: ${({ theme }) => theme.colors.background.lighterBlue};
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-radius: 0.8rem;
  }

  .auto {
    margin-block-start: 3rem;
    text-align: center;

    a {
      display: block;
      color: ${({ theme }) => theme.colors.text.lightGray};
      font-size: 1.4rem;
      margin-block-start: 1rem;
    }
  }
`;

export default PageWrapper;
