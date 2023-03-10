import styled from 'styled-components';
import Layout from 'components/Layout';

export const PageWrapper = styled(Layout)`
  background: ${({ theme }) => theme.colors.background.light};
  display: flex;
  flex-direction: column;
  padding: 0 20;

  // 使畫面可上下捲動
  height: 100vh;
  overflow: auto;

  .info {
    margin-bottom: 2rem;
  }
`;

export const EditRecordFormWrapper = styled(Layout)`
  background: ${({ theme }) => theme.colors.background.light};
  display: flex;
  flex-direction: column;
  padding: 0 20;
  min-height: fit-content;

  overflow: auto;

  .edit_form {
    display: grid;
    align-content: flex-start;
    grid-gap: 2rem;

    min-height: fit-content;

    margin: 2rem 0;
  }

  .record_target_list {
    margin: 2.4rem 2rem;
  }

  .meta_info {
    color: ${({ theme }) => theme.colors.text.point};
    margin-bottom: 2rem;
    text-align: center;
  }
`;
