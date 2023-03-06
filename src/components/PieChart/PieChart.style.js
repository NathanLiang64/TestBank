import styled from 'styled-components';

const handleSpaceType = (position) => {
  switch (position) {
    case 'top':
      return 'margin-top: 5.4rem;';
    case 'bottom':
      return 'margin-bottom: 5.4rem;';
    case 'both':
      return 'margin: 5.4rem 0;';
    default:
      return ';';
  }
};

const PieChartWrapper = styled.div`
  position: relative;
  width: ${({ $isCentered }) => ($isCentered ? '100%' : 'fit-content')};
  margin: 1rem 0;
  ${({ $space }) => handleSpaceType($space)};

  .group {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    justify-content: center;
    -webkit-justify-content: center;
    align-items: center;
    -webkit-align-items: center;
  }

  .label {
    color: ${({ theme }) => theme.colors.text.lightGray};
    font-size: 1.4rem;
  }

  .balance {
    color: ${({ theme }) => theme.colors.primary.dark};
    font-size: 2rem;
    font-weight: 400;
    line-height: 3rem;
  }
  .small {
    font-size: 1.5rem;
  }

  canvas {
    filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.25));
  }
`;

export default PieChartWrapper;
