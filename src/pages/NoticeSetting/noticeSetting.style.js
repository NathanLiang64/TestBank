import styled from 'styled-components';
import Layout from 'components/Layout';
import theme from 'themes/theme';

const NoticeSettingWrapper = styled(Layout)`
  .noticeContainer {
    &.all {
      margin-bottom: 2rem;
    }
    &:nth-child(6) {
      border-bottom: 1px solid ${theme.colors.border.lighter};
    }
  }
  .sectionLabel {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 45px;
    line-height: 45px;
    padding: 0 1.6rem;
    transition: all .3s ease;
    font-size: 100%;
    border-radius: 0;
    span {
      display: flex;
      align-items: center;
    }
    &.on {
      background-color: ${theme.colors.primary.light};
      color: white;
    }
    .MuiIconButton-root {
      padding: 0px;
    }
  }
  .MuiCollapse-container {
    width: 100%;
  }
  &.settingPage {
    .MuiFormControlLabel-root {
      left: -1.6rem;
    }
  }
  .customNoticeArea {
    ol {
      padding-left: 2.4rem;
      li {
        list-style-type: decimal;
        margin-bottom: 1rem;
      }
    }
  }
`;

export default NoticeSettingWrapper;
