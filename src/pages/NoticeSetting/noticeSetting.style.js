import styled from 'styled-components';
import Layout from 'components/Layout';
import theme from 'themes/theme';

const NoticeSettingWrapper = styled(Layout)`
  .agreeLabel {
    p {
      font-size: 1rem;
    }
  }
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
  .tip {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 2rem 0 1rem;
    span {
      margin-right: 0.2rem;
    }
  }
  &.settingPage {
    .MuiFormControlLabel-root {
      left: -1.6rem;
    }
  }
  .customNoticeArea {
    margin-bottom: 0;
  }
`;

export default NoticeSettingWrapper;
