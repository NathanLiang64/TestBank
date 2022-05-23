import styled from 'styled-components';

const PieChartWrapper = styled.div`
  position: relative;
  width: fit-content;

  .group {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .label {
    color: ${({ theme }) => theme.colors.text.lightGray};
    font-size: 1.4rem;
  }

  .balance {
    color: ${({ theme }) => theme.colors.primary.dark};
    font-size: 2rem;
    font-weight: 500;
    line-height: 3rem;
  }

  canvas {
    filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.25));
    margin-inline: auto;
  }
`;

export default PieChartWrapper;
