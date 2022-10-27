import styled from 'styled-components';

const AccountCardWrapper = styled.div`
  // display: flex; // iOS safari v14.5以下不支援flex的gap屬性
  // flex-direction: column;
  display: grid;
  grid-auto-flow: row;
  gap: 1.2rem;
  padding: 1.6rem;
`;

export default AccountCardWrapper;
