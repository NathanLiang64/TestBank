import styled from 'styled-components';
import Layout from 'components/Layout';
import theme from 'themes/theme';

const NoticeSettingWrapper = styled(Layout)`
  .noticeContainer {
    transform: translateX(-1.6rem);
    width: 100vw;
    border-top: 1px solid ${theme.colors.border.lighter};
    &.all {
      border-top: 1px solid ${theme.colors.border.lighter};
      border-bottom: 1px solid ${theme.colors.border.lighter};
      margin-bottom: 2rem;
    }
    &:nth-child(6) {
      border-bottom: 1px solid ${theme.colors.border.lighter};
    }
  }
  .sectionLabel {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 45px;
    padding: 0 1.6rem;
    transition: all .3s ease;
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
  .MuiFormControlLabel-label {
    font-size: 100%;
  }
  .MuiFormControlLabel-labelPlacementStart {
    height: 45px;
    margin-left: 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1.6rem;
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
`;

export default NoticeSettingWrapper;