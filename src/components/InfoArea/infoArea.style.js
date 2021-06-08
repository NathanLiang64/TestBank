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

const InfoAreaWrapper = styled.div`
  margin: ${({ $space }) => handleSpaceType($space)};
  padding: 1.6rem;
  border-radius: .4rem;
  font-size: 1.4rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.dark};
  background: ${({ theme }) => theme.colors.background.lighterBlue};
  
  * {
    color: ${({ theme }) => theme.colors.text.dark};
  }
`;

export default InfoAreaWrapper;
