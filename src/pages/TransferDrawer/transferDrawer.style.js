import styled from 'styled-components';

const TransferDrawerWrapper = styled.div`
  padding: 0 1.6rem 2.4rem 1.6rem;

  .addMemberButtonArea {
    display: flex;
    align-items: center;
    padding: 1.2rem .8rem;
    border-top: .1rem solid ${({ theme }) => theme.colors.border.lighter};
    border-bottom: .1rem solid ${({ theme }) => theme.colors.border.lighter};
  }

  .addMemberButtonIcon {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    width: 4.4rem;
    height: 4.4rem;
    background: ${({ theme }) => theme.colors.primary.light};

    .Icon {
      font-size: 2rem;
      color: ${({ theme }) => theme.colors.basic.white};
    }
  }

  .addMemberButtonText {
    margin-left: 1.2rem;
    font-size: 1.6rem;
    color: ${({ theme }) => theme.colors.primary.light};
  }

  .addFrequentlyUsedAccountArea,
  .editDesignedAccountArea {
    text-align: center;

    .Avatar {
      display: inline-block;
      margin-bottom: 1.6rem;
    }

    label {
      text-align: left;
    }
  }
  
  .editDesignedAccountArea {
    .accountArea {
      margin-bottom: 1.6rem;
      padding: 1.6rem 1.2rem;
      border-radius: .8rem;
      font-size: 1.6rem;
      color: ${({ theme }) => theme.colors.text.lightGray};
      background: ${({ theme }) => theme.colors.background.lighterBlue};
      
      p {
        margin-top: 1.2rem;
      }
    }
  }
`;

export default TransferDrawerWrapper;
