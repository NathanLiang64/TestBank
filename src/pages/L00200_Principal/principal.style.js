import styled from 'styled-components';
import Layout from 'components/Layout';

const PrincipalWrapper = styled(Layout)`
  padding: 0;

  .sectionTop {
    border-bottom: .8rem solid ${({ theme }) => theme.colors.background.lighterBlue};
  }

  .detailUl {
    padding: 2.4rem 3.2rem 0;
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: .1rem solid ${({ theme }) => theme.colors.border.lightest};
      padding: 1rem 0;

      &:last-child {
        border-bottom: none;
      }
      span {
        &:first-child {
          font-size: 1.4rem;
          color: ${({ theme }) => theme.colors.primary.light};
        }
        &:last-child {
          font-size: 1.4rem;
          color: #032146;
        }
      }
    }
  }

  .noticeTip {
    color: ${({ theme }) => theme.colors.text.light};
    font-size: 1.4rem;
    padding: 2.4rem 3.2rem;
    line-height: 150%;
  }
`;

export default PrincipalWrapper;
