import styled from 'styled-components';

const ReminderWrapper = styled.div`
  // iOS safari v14.5以下不支援flex的gap屬性
  display: grid;
  justify-content: center;
  grid-auto-flow: column;
  margin-inline: auto;
  padding-inline: 4rem;
  gap: 2rem;
  min-height: 4.6rem;
  max-width: 100%;

  .auto {
    flex: 1 1 auto;
    -webkit-flex: 1 1 auto;
    width: fit-content;

    p {
      margin: 0;
      align-text: start;
      white-space: nowrap;
      color: ${({ theme }) => theme.colors.text.light};
    }
  }

  .badIcon {
    display: block;
    margin: -1.1rem;
    height: fit-content;
  }
`;

export default ReminderWrapper;
