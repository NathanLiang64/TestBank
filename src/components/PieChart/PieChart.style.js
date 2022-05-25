import styled from 'styled-components';

const handleSpaceType = (position) => {
  switch (position) {
    case 'top':
      return 'margin-block-start: 5.4rem;';
    case 'bottom':
      return 'margin-block-end: 5.4rem;';
    case 'both':
      return 'margin-block: 5.4rem;';
    default:
      return ';';
  }
};

const PieChartWrapper = styled.div`
  position: relative;
  width: ${({ $isCentered }) => ($isCentered ? '100%' : 'fit-content')};
  margin-block: 1rem;
  ${({ $space }) => handleSpaceType($space)};

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
