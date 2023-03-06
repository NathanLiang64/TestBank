import styled from 'styled-components';

const ProgressBarWrapper = styled.div`
  --purple-light: #9301BE;
  --purple-dark: #4F01FF;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 2.4rem;

  .progress {
    position: relative;
    background-color: ${({ theme }) => theme.colors.background.cancel};
    flex: 1; 
    height: 0.4rem;
    border-radius: 0.4rem;

    .bar {
      position: absolute;
      background-image: linear-gradient(90deg, var(--purple-light) 8%, var(--purple-dark) 92%);
      height: 0.4rem;
      border-radius: 0.4rem;
      min-width: 1.2rem;
      max-width: calc(100% - 1.2rem);
    }

    .circle {
      position: absolute;
      top: -1rem;
      right: -1rem;
      width: 2.4rem;
      height: 2.4rem;
      background-color: var(--purple-dark);
      color: ${({ theme }) => theme.colors.basic.white};
      border-radius: 100%;
      font-size: 0.9rem;
      font-weight: 500;
      text-align: center;
      line-height: 2.4rem;
    }
  }

  .percent {
    font-size: 1.35rem;
    color: ${({ theme }) => theme.colors.primary.brand};
    margin-left: 0.5rem;
  }
`;

export default ProgressBarWrapper;
