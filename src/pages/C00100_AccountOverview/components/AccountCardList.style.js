import styled from 'styled-components';

const AccountCardWrapper = styled.div`
  // display: flex; // iOS safari v14.5以下不支援flex的gap屬性
  // flex-direction: column;
  display: grid;
  grid-auto-flow: row;
  grid-gap: 1.2rem;
  padding: 1.6rem;

  .warning_text {
    color: ${({ theme }) => theme.colors.primary.dark};
    text-align: center;
    font-weight: 500;
    font-size: 1.8rem;
  }
`;

export default AccountCardWrapper;
