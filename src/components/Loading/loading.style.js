import styled from 'styled-components';

const handleSpaceType = (position) => {
  switch (position) {
    case 'top':
      return '2.4rem 0 0 0';
    case 'bottom':
      return '0 0 2.4rem 0';
    case 'both':
      return '2.4rem 0';
    default:
      return '0';
  }
};

const LoadingWrapper = styled.div`
  ${({ $isFullscreen }) => $isFullscreen && `
    display: flex;
    height: 100vh;
    width: 100vw;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.background.light};
  `}

  ${({ $isCentered }) => $isCentered && `
    margin: 0 auto;
    width: min-content;
  `}

  padding: ${({ $space }) => handleSpaceType($space)};
  
  .MuiCircularProgress-svg {
    color: ${({ $color, theme }) => $color || theme.colors.primary.light};
  }
`;

export default LoadingWrapper;
