import styled from 'styled-components';

const ReminderWrapper = styled.div`
  display: flex;
  color: ${({ theme }) => theme.colors.text.light};
  margin-inline: 4rem;
  min-height: 4.6rem;

  .auto {
    flex: 1 1 100%;
  }
`;

export default ReminderWrapper;
