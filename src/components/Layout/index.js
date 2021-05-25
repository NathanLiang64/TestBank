import styled from 'styled-components';

/*
* ==================== Layout 組件說明 ====================
* 此組件便為每個頁面的基礎布局，未來可能會有更多樣式
* ================ ConfirmButtons 可傳參數 ================
* 1. fullScreen -> 左右兩側無留白
* 2. inDialog -> 四邊皆無留白，放置於 Dialog 的頁面內適用
* */

const Layout = styled.main`
  ${({ inDialog }) => (inDialog ? null : 'margin-top: 4.8rem')};
  ${({ inDialog, fullScreen }) => ((inDialog || fullScreen) ? null : 'padding: 2.4rem 1.6rem')};
  height: 100%;
  overflow-y: auto;
`;

export default Layout;
