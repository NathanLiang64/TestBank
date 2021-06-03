import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* ========== Reset.css ========== */
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed, 
  figure, figcaption, footer, header, hgroup, 
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font: inherit;
    font-size: 100%;
    vertical-align: baseline;
  }
  
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure, 
  footer, header, hgroup, menu, nav, section {
    display: block;
  }
  body {
    line-height: 1;
  }
  ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  
  /* ========== Custom ========== */
  * {
    position: relative;
    box-sizing: border-box;
    font-family: ${({ theme }) => theme.font} !important;
    letter-spacing: .1rem !important;
  }
  
  html {
    height: 100%;
    font-size: 62.5%;
  }
  
  body {
    height: calc(100% - 4.4rem);
    font-size: 1.6rem;
    font-family: ${({ theme }) => theme.font};
    line-height: 1.43;
    color: ${({ theme }) => theme.colors.text.dark};
  }
  
  #root {
    height: 100%;
  }
  
  button {
    border: 0;
    outline: 0;
    color: inherit;
    background: transparent;
    
    &:disabled {
      &:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        border-radius: inherit;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, .6);
      }
    }
  }
  
  img {
    width: 100%;
  }

  table {
    border: .1rem solid ${({ theme }) => theme.colors.primary.lightest};
    width: 100%;
    font-size: 1.4rem;
    background: white;

    tr {
      border-bottom: .1rem solid ${({ theme }) => theme.colors.border.lighter};

      td {
        border-right: .1rem solid ${({ theme }) => theme.colors.border.lighter};
        padding: .8rem;

        &:first-child {
          color: ${({ theme }) => theme.colors.primary.dark};
        }
      }
    }
  }
  
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, em, i {
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.text.dark};
  }

  a {
    text-decoration: none;
  }

  .formItem {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.6rem;
    width: 100%;
  }

  .material-icons {
    font-family: 'Material Icons', sans-serif !important;
  }
  
  .MuiBackdrop-root {
    background: ${({ theme }) => theme.colors.background.mask} !important;
    backdrop-filter: ${({ theme }) => `blur(${theme.filters.blur})`};
  }

  .swiper-pagination-bullet {
    width: .6rem;
    height: .6rem;
    background: ${({ theme }) => theme.colors.text.light};
    transition: all .2s;

    &-active {
      width: .8rem;
      height: .8rem;
      transform: translateY(.15rem);
    }
  }
`;

export default GlobalStyles;
