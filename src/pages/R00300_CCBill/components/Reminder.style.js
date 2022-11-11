import styled from 'styled-components';

const ReminderWrapper = styled.div`
  // display: flex; // iOS safari v14.5以下不支援flex的gap屬性
  // display: -webkit-flex;
  display: grid;
  grid-auto-flow: column;
  color: ${({ theme }) => theme.colors.text.light};
  margin-inline: auto;
  padding-inline: 4rem;
  gap: 3rem;
  min-height: 4.6rem;

  .auto {
    flex: 1 1 auto;
    -webkit-flex: 1 1 auto;
    width: fit-content;

    p {
      margin: 0;
      align-text: start;
      white-space: nowrap;
    }
  }

  .badIcon {
    display: block;
    margin: -1.1rem;
    height: fit-content;
  }
`;

export default ReminderWrapper;
