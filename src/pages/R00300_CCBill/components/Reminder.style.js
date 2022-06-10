import styled from 'styled-components';

const ReminderWrapper = styled.div`
  display: flex;
  color: ${({ theme }) => theme.colors.text.light};
  margin-inline: auto;
  padding-inline: 4rem;
  gap: 3rem;
  min-height: 4.6rem;

  .auto {
    flex: 1 1 auto;
    width: fit-content;
  }

  .Icon {
    transform: translateY(0.2rem);
  }
`;

export default ReminderWrapper;
