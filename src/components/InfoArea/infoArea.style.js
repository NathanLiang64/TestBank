import styled from 'styled-components';

const handleSpaceType = (position) => {
  switch (position) {
    case 'top':
      return '1.6rem 1.6rem 0 1.6rem';
    case 'bottom':
      return '0 1.6rem 1.6rem 1.6rem';
    case 'both':
      return '1.6rem 1.6rem';
    case 'auto':
      return '1.6rem auto';
    default:
      return '0 1.6rem';
  }
};

const variants = (variant) => {
  switch (variant) {
    case 'top':
      return `
        padding: .4rem;
        border-radius: .8rem;
        font-size: 1.4rem;
      `;
    default:
      return `
        padding: .4rem;
        border-radius: .8rem;
        font-size: 1.2rem;
      `;
  }
};

const InfoAreaWrapper = styled.div`
  margin: ${({ $space }) => handleSpaceType($space)};
  ${({ $space }) => $space === 'auto' && 'min-width: 200px; width: fit-content;'}
  ${({ $variant }) => variants($variant)}
  text-align: center;
  color: ${({ $color, theme }) => $color || theme.colors.primary.light};
  background: ${({ $bgColor, theme }) => $bgColor || theme.colors.primary.lightest};
  
  * {
    color: ${({ $color, theme }) => $color || theme.colors.primary.light};
  }

  .polygon {
    position: absolute;
    overflow: hidden;

    &.top {
      width: 0;
      height: 0;
      border-left: 0.5rem solid transparent;
      border-right: 0.5rem solid transparent;
      border-bottom: 1rem solid ${({ $bgColor, theme }) => $bgColor || theme.colors.primary.lightest};
      left: 1.5rem;
      top: -1rem;
    }

    &.bottom {
      background: ${({ $bgColor, theme }) => $bgColor || theme.colors.primary.lightest};
      width: 1.4rem;
      height: 1.2rem;
      border-radius: 0 0 1.2rem 0;
      right: 19%;
      bottom: -1.2rem;
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
  }
`;

export default InfoAreaWrapper;
