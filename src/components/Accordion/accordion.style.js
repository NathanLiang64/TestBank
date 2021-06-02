import styled from 'styled-components';
import theme from 'themes/theme';

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

const AccordionWrapper = styled.div`
  margin: ${({ $space }) => handleSpaceType($space)};
  background: #F3F5FC;
  border-radius: 4px;
  button {
    padding: 0 3px 0 12px;
    text-align: left;
    width: 100%;
    height: 48px;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &.open {
      .MuiSvgIcon-root {
        transform: rotate(180deg);
      }
    }
  }
  .content {
    padding: 0 12px 12px;
    max-height: 32rem;
    font-size: 14px;
    overflow: auto;
    color: ${theme.colors.text.light};
    * {
      color: ${theme.colors.text.light};
    }
    .line {
      width: 100%;
      height: 1px;
      background: #fff;
      margin-bottom: 12px;
    }
  }
`;

export default AccordionWrapper;
