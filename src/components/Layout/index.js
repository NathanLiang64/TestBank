import styled from 'styled-components';

/*
* ==================== Layout 組件說明 ====================
* 此組件便為每個頁面的基礎布局，未來可能會有更多樣式
* ================ ConfirmButtons 可傳參數 ================
* 1. fullScreen -> 滿版布局
* */

const Layout = styled.main`
  margin-top: 4.8rem;
  ${({ fullScreen }) => (fullScreen ? null : 'padding: 2.4rem 1.6rem')};
  height: 100%;
  overflow-y: scroll;
`;

export default Layout;
