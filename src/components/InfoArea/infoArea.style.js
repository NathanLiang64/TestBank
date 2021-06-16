import styled from 'styled-components';

const handleSpaceType = (position) => {
  switch (position) {
    case 'top':
      return '2.4rem 1.6rem 0 1.6rem';
    case 'bottom':
      return '0 1.6rem 2.4rem 1.6rem';
    case 'both':
      return '2.4rem 1.6rem';
    default:
      return '0 1.6rem';
  }
};

const InfoAreaWrapper = styled.div`
  margin: ${({ $space }) => handleSpaceType($space)};
  padding: .8rem;
  border-radius: .4rem;
  font-size: 1.2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.primary.light};
  background: ${({ theme }) => theme.colors.primary.lightest};
  
  * {
    color: ${({ theme }) => theme.colors.primary.light};
  }
`;

export default InfoAreaWrapper;
