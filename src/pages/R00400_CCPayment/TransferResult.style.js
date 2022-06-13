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
    color: ${({ theme }) => theme.colors.text.lightGray};
  }

  .text-gray {
    font-size: 1.4rem;
    color: ${({ theme }) => theme.colors.text.lightGray};
  }

  .auto {
    margin-block-start: 3rem;
    text-align: center;

    button {
      color: ${({ theme }) => theme.colors.text.dark};
      margin-block-start: 0.8rem;
    }

    .circle {
      border: 2px solid ${({ theme }) => theme.colors.text.dark};
      display: inline-block;
      width: 1.6rem;
      height: 1.6rem;
      border-radius: 100%;
      margin-right: 0.4rem;
      vertical-align: -0.2rem;
    }
  }

`;

export default PageWrapper;
