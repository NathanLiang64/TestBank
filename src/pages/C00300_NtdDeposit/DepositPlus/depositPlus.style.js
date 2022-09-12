import styled from 'styled-components';
import Layout from 'components/Layout';

const DepositPlusWrapper = styled(Layout)`

  .tabList {
    margin-bottom: 1.6rem;
  }
  
  .mainArea {
    padding: 1.6rem 1.2rem;
    border-radius: .8rem;
    text-align: center;
    background: ${({ theme }) => theme.colors.background.lighterBlue};
    
    h3 {
      font-size: 3rem;
      font-weight: 500;
      color: ${({ theme }) => theme.colors.primary.dark};
    }
    
    span {
      font-size: 1.4rem;
      color: ${({ theme }) => theme.colors.text.lightGray};
    }
  }
  
  .detailArea {
    margin-top: .8rem;
  }
  
  .starIcon {
    font-size: 1.6rem;
    color: ${({ theme }) => theme.colors.background.star};
  }
  
  .sectionTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.6rem 0;
    
    h3 {
      font-size: 1.8rem;
    }
    
    button {
      top: -.2rem;
      display: flex;
      align-items: center;
      padding-right: 0;
      font-size: 1.4rem;
      
      .MuiSvgIcon-root {
        top: .1rem;
        margin-left: .4rem;
        font-size: 1.7rem;
        color: ${({ theme }) => theme.colors.primary.light};
      }
    }
  }
  
  .detailList {
    padding: 1.6rem 0;
    border-top: .1rem solid ${({ theme }) => theme.colors.border.lightest};
    border-bottom: .1rem solid ${({ theme }) => theme.colors.border.lightest};

    li {
      display: flex;
      justify-content: space-between;

      &:not(:last-child) {
        margin-bottom: 1.6rem;
      }

      &.listHead {
        color: ${({ theme }) => theme.colors.primary.light};
      }

      &.listBody {

        p {
          font-size: 1.6rem;
          color: ${({ theme }) => theme.colors.text.lightGray};

          &.limitPrice {
            font-size: 1.8rem;
            font-weight: 700;
            color: ${({ theme }) => theme.colors.text.dark};
          }

          .starIcon {
            top: .2rem;
            margin-left: .4rem;
          }
        }

        span {
          color: ${({ theme }) => theme.colors.text.light};
        }
      }

      span {
        font-size: 1.2rem;
      }
    }
  }
  
  .remarkArea {
    margin: 1.6rem 0;

    span {
      font-size: 1.2rem;
      color: ${({ theme }) => theme.colors.text.light};
    }
    
    .starIcon {
      top: .3rem;
      margin-left: .2rem;
      margin-right: .2rem;
    }
  }
`;

const LevelDialogContentWrapper = styled.div`

  table {
    tbody {
      font-size: 1.2rem;
    }
    
    thead > tr > th:nth-child(2) {
      max-width: 12rem;
    }
  }
`;

export default DepositPlusWrapper;
export { LevelDialogContentWrapper };
