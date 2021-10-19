import styled from 'styled-components';

const AccountDetailsSearchCondition = styled.div`
  padding: 0 1.6rem 4rem;
  
  .autoDateArea {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1.6rem;
    border-radius: 1rem;
    height: 8rem;
    background: ${({ theme }) => theme.colors.background.lighterBlue};

    p {
      font-size: 1.8rem;
      color: ${({ theme }) => theme.colors.primary.brand};
    }
    
    input {
      display: none;
    }
  }

  .keywordArea {
    margin-bottom: 3.4rem;

    .defaultKeywords {
      margin-top: 1.6rem;
    }
  }

  .dateRangePickerArea {
    margin-bottom: 3.4rem;
  }
`;

export default AccountDetailsSearchCondition;
