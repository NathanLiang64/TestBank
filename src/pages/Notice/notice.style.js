import styled from 'styled-components';
import Layout from 'components/Layout';
// import theme from 'themes/theme';

const NoticeWrapper = styled(Layout)`
  .button-container {    
    display: flex;
    margin-bottom: 1rem;
    button:first-child {
      margin-right: 0.5rem;
    }
    button:last-child {
      margin-left: 0.5rem;
    }
  }
  .noticeCard {
    width: 100%;
    text-align: left;
    font-size: 100%;
    display: flex;
    align-items: center;
    padding: 1rem;
    border-bottom: ${({ theme }) => `.1rem solid ${theme.colors.border.lighter}`};
    min-height: 100px;
    position: relative;
    .alertIcon {
      padding: 1rem 1rem 1rem 0;
    }
    .right {
      display: flex;
      flex-direction: column;
      min-height: calc(100px - 2rem);
      justify-content: space-between;
      .content {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .date {
        color: ${({ theme }) => `${theme.colors.text.light}}`};
      }
    }
  }
  &.contentWrapper {
    p {
      margin-bottom: 1rem;
    }
    .noticeTitle {
      font-weight: bold;
    }
    .dateStr {
      color: ${({ theme }) => `${theme.colors.text.light}}`};
    }
    .reminder {
      color: ${({ theme }) => `${theme.colors.primary.brand}}`};
    }
  }
`;

export default NoticeWrapper;
