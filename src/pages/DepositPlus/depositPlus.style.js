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
            font-weight: 300;
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
    caption {
      text-align: center;
    }

    thead {
      tr {
        th {
          word-break: keep-all;
          vertical-align: middle;
        }
        
        th:nth-child(2) {
          max-width: 12rem;
        }
      }
    }
    
    tbody {
      font-size: 1.2rem;
    }
    tbody.rowRight2 > tr > td:nth-child(2),
    tbody.rowRight2 > tr > td:nth-child(3) {
      text-align: center;
    }
  }
`;

const DepositPlusDetailWrapper = styled(Layout)`
  background-color: ${({ theme }) => theme.colors.basic.white};

  .activityCard:nth-child(1) {
    border-top: 1rem solid ${({ theme }) => theme.colors.background.lighterBlue};
  }
  .activityCard {
    margin: 0 -1.6rem 1rem -1.6rem;
    padding: 1rem;
    background-color: ${({ theme }) => theme.colors.basic.white};
    border-bottom: 1rem solid ${({ theme }) => theme.colors.background.lighterBlue};

    .activityCard_upper {
      color: ${({ theme }) => theme.colors.text.dark};
      padding: 1rem 0.5rem 2rem 0.5rem;
      border-bottom: 1px solid ${({ theme }) => theme.colors.border.lightest};

      display: flex;

      .title {
        margin-right: auto;
        font-size: 120%;
      }
      .detail {
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size: 90%;
      }
    }
    .activityCard_lower {
      padding: 2rem 0.5rem 1rem 0.5rem;
      color: ${({ theme }) => theme.colors.text.light};
      font-size: 90%;
      font-weight: 300;
    }
  }
`;

export default DepositPlusWrapper;
export { LevelDialogContentWrapper };
export { DepositPlusDetailWrapper };
