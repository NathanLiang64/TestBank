import styled from 'styled-components';
import { MainScrollWrapper } from 'components/Layout';

const AccountDetailsWrapper = styled(MainScrollWrapper)`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.background.lighterBlue};

  .measuredHeight {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    height: calc(100% - 21.3rem);
  }

  .debitCardWrapper {
    margin-top: 4.4rem;
    padding: 1.6rem 1rem 2.6rem 1rem;
  }

  .debitCard {
    margin-bottom: .8rem;
  }

  .inquiryArea {
    padding: 0 .5rem;
    border-top-left-radius: 3rem;
    border-top-right-radius: 3rem;
    width: 100%;
    background: ${({ theme }) => theme.colors.basic.white};
  }

  .transactionDetail {
    padding: 0 .4rem;
    height: 100%;
    overflow-y: auto;

    .emptyDataWrapper {
      width: 100%;
      height: 40vh;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .searchBar {
    display: flex;
    align-items: center;
    min-height: 5.2rem;
    margin-bottom: .8rem;
    padding: .4rem .6rem;

    p {
      font-size: 1.4rem;
      color: ${({ theme }) => theme.colors.primary.light};
    }

    .searchCondition {
      top: .2rem;
      display: flex;
      align-items: center;
      margin-left: .2rem;
      color: ${({ theme }) => theme.colors.text.dark};
      
      .Icon {
        left: -.4rem;
        font-size: 1.6rem;
      }
    }
  }

  .tabsArea {
    padding: 0 1.6rem;

    .tabList {
      margin-bottom: 1.6rem;
    }
  }

  .customPosition {
    position: absolute;
    top: 50%;
    right: 1.2rem;
    transform: translateY(-50%);
  }
`;

const DownloadDrawerWrapper = styled.ul`
  
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .Icon.downloadIcon {
      font-size: 2rem;
      margin-right: 2rem;
      color: ${({ theme }) => theme.colors.text.dark};
    }
  }
`;

export default AccountDetailsWrapper;
export { DownloadDrawerWrapper };
