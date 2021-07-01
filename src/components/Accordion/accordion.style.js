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

const AccordionWrapper = styled.div`
  margin: ${({ $space }) => handleSpaceType($space)};
  border-radius: .4rem;
  background: ${({ theme }) => theme.colors.background.lighterBlue};

  button {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 .6rem 0 1.2rem;
    width: 100%;
    min-height: 4.8rem;
    font-size: 1.6rem;
    text-align: left;

    h3 {
      padding: 1.2rem 0;
    }
  }
  .content {
    padding: 0 1.2rem 1.2rem;
    max-height: 32rem;
    font-size: 1.4rem;
    color: ${({ theme }) => theme.colors.text.light};
    overflow: auto;

    * {
      color: ${({ theme }) => theme.colors.text.light};
    }
    
    ol {
      padding-left: 2.4rem;

      li {
        list-style-type: decimal;
      }
    }
    
    li {
      margin-bottom: 1.2rem;
    }

    .line {
      margin-bottom: 1.2rem;
      width: 100%;
      height: .1rem;
      background: ${({ theme }) => theme.colors.basic.white};
    }
  }
`;

export default AccordionWrapper;
