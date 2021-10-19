import styled from 'styled-components';
import Layout from 'components/Layout';

const AccountDetailsWrapper = styled(Layout)`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.background.lighterBlue};

  .measuredHeight {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    height: calc(100% - 18.5rem);
  }

  .debitCard {
    margin-bottom: .8rem;
  }

  .inquiryArea {
    left: -1.6rem;
    border-top-left-radius: 3rem;
    border-top-right-radius: 3rem;
    width: 100vw;
    background: ${({ theme }) => theme.colors.basic.white};
  }

  .transactionDetail {
    padding: 0 .4rem;
    height: 100%;
    overflow-y: auto;
  }

  .searchBar {
    display: flex;
    align-items: center;

    p {
      margin: 0 -.4rem;
      font-size: 1.4rem;
      color: ${({ theme }) => theme.colors.primary.light};
    }

    .searchCondition {
      display: flex;
      align-items: center;
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
    right: 0;
    transform: translateY(-50%);
  }
`;

const DownloadDrawerWrapper = styled.ul`
  
  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .MuiSvgIcon-root.downloadIcon {
      font-size: 2.8rem;
      margin-right: 1.8rem;
      color: ${({ theme }) => theme.colors.text.dark};
    }
  }
`;

export default AccountDetailsWrapper;
export { DownloadDrawerWrapper };
