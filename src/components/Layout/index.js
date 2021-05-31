import styled from 'styled-components';

/*
* ==================== Layout 組件說明 ====================
* 此組件方便為每個頁面的基礎布局，未來可能會有更多樣式
* ================ ConfirmButtons 可傳參數 ================
* 1. fullScreen -> 左右兩側無留白
* 2. inDialog -> 四邊皆無留白，放置於 Dialog 的頁面內適用
* 3. small -> 上方留白間距大小
*    預設 padding-top 是 24，加上 small 參數則是 8，用於頂部為卡片組件的介面
* */

const Layout = styled.main`
  ${({ inDialog }) => (inDialog ? null : 'margin-top: 4.4rem')};
  ${({ inDialog, fullScreen }) => ((inDialog || fullScreen) ? null : 'padding: 2.4rem 1.6rem')};
  padding-top: ${({ small }) => small && '.8rem'};
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
`;

export default Layout;
