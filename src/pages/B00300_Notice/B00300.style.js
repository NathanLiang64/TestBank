import styled from 'styled-components';
import Layout from 'components/Layout';
// import theme from 'themes/theme';

const NoticeWrapper = styled(Layout)`
  padding: 0;
  .lighterBlueLine {
    border-bottom: none;
  }
  .noticeContainer {
    padding: 1.6rem;
    .settingEditContainer {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 2.4rem;
      .btn {
        display: flex;
        align-items: center;
        // width: 6rem;
        height: 2rem;
        font-size: 1.4rem;
        font-weight: 500;
        padding: 0 .8rem;
        img {
          margin-left: .4rem;
          width: 2rem;
          height: 2rem;
        }
        &.edit {
          margin-left: .8rem;
        }
      }
    }
    .MuiTabs-root::after {
      background: unset;
    }
    .unReadTab {
      &::after {
        content: ' ';
        position: absolute;
        top: 0;
        right: 0;
  
        width: .8rem;
        height: .8rem;
        border-radius: 50%;
        background: ${({ theme }) => theme.colors.state.danger};
      }
    }
    .notifyItem {
      padding: 2rem 3.4rem 2rem 2rem;
      border-bottom: .1rem solid ${({ theme }) => theme.colors.text.placeholder};
      &:last-child {
        border-bottom: none;
      }
      &.newMsg {
        &::before {
          content: ' ';
          position: absolute;
          width: .8rem;
          height: .8rem;
          border-radius: 50%;
          background: ${({ theme }) => theme.colors.state.danger};
          left: 0;
          top: 2.6rem;
        }
      }
      section:first-child {
        display: flex;
        justify-content: space-between;
        .notifyTitle {
          font-weight: 400;
          font-size: 1.4rem;
          line-height: 1.9rem;
          color: ${({ theme }) => theme.colors.primary.dark};
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          flex: 1 1 auto;
        }
        .notifyTime {
          font-weight: 400;
          font-size: 1.2rem;
          line-height: 1.6rem;
          color: ${({ theme }) => theme.colors.text.light};
          width: 12rem;
          flex: 1 0 auto;
          text-align: right;
        }
      }
      .notifyContent {
        word-break: break-all;
        margin-top: .8rem;
        font-weight: 400;
        font-size: 1.4rem;
        line-height: 1.9rem;
        min-height: 3.8rem;
        // max-height: 7.6rem;
        color: ${({ theme }) => theme.colors.text.lightGray};
        overflow: hidden;
        display: -webkit-box;
        // -webkit-line-clamp: 4;   /*省略第n行後的文字*/ 目前的需求是全部顯示
        -webkit-box-orient: vertical;  /*設定元素是垂直布局*/
      }
      .deleteBtn {
        position: absolute;
        width: 6.8rem;
        height: 100%;
        background: ${({ theme }) => theme.colors.state.danger};
        top: 0;
        right: -1.6rem;
        color: ${({ theme }) => theme.colors.basic.white};
        font-weight: 400;
        font-size: 1.2rem;
        line-height: 1.8rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transition: right .3s ease-in-out;
        img {
          width: 1.6rem;
          height: 1.8rem;
          margin-bottom: .5rem;
        }
        &.hide {
          right: calc(-1.6rem - 6.8rem);
        }
      }
    }
  }
`;

export default NoticeWrapper;
