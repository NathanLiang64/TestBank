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
  padding: ${({ $space }) => handleSpaceType($space)};
  
  .MuiCircularProgress-svg {
    color: ${({ $color, theme }) => $color || theme.colors.primary.light};
  }
`;

export default LoadingWrapper;
