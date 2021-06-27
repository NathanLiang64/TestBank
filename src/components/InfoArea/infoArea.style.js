import styled from 'styled-components';

const handleSpaceType = (position) => {
  switch (position) {
    case 'top':
      return '1.6rem 1.6rem 0 1.6rem';
    case 'bottom':
      return '0 1.6rem 1.6rem 1.6rem';
    case 'both':
      return '1.6rem 1.6rem';
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
  .polygon {
    background: ${({ theme }) => theme.colors.primary.lightest};
    width: 1.4rem;
    height: 1.2rem;
    position: absolute;
    right: 19%;
    bottom: -1.2rem;
    overflow: hidden;
    border-radius: 0 0 1.2rem 0;
    &:before {
      content: ' ';
      background: #fff;
      width: 1.4rem;
      height: 1.2rem;
      position: absolute;
      left: -0.7rem;
      top: 0;
      border-radius: 0 10rem 5rem 0;
    }
  }
`;

export default InfoAreaWrapper;
