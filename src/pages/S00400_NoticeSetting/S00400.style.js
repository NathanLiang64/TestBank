import styled from 'styled-components';
import Layout from 'components/Layout';

const NoticeSettingWrapper = styled(Layout)`
    .settingItem {
      padding: 2.6rem .8rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: .1rem solid ${({ theme }) => theme.colors.text.placeholder};
      &:last-child {
        border-bottom: .1rem solid ${({ theme }) => theme.colors.text.placeholder};
      }
      .settingLabel {
        display: flex;
        flex-direction: column;
        .main {
          font-weight: 400;
          font-size: 1.6rem;
          line-height: 2.4rem;
          color: ${({ theme }) => theme.colors.text.dark};
        }
        .sub {
          font-weight: 400;
          font-size: 1.2rem;
          line-height: 1.8rem;
          color: ${({ theme }) => theme.colors.text.light};
        }
      }
    }
  .term_container {
    height: 20rem;
    padding: 0 0 1rem 0;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .accordion {
      .collapseContent {
        max-height: 8rem;
      }
      .accordion_content {
        list-style-position: outside;
      }
    }
  }
`;

export default NoticeSettingWrapper;
