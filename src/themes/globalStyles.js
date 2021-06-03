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
  
  /* calendar styles */
  .e-range-header {
    background: ${({ theme }) => theme.colors.primary.brand};
  }
  
  .e-bigger .e-daterangepicker.e-device.e-popup .e-range-header, *.e-bigger.e-daterangepicker.e-device.e-popup .e-range-header, *.e-device.e-daterangepicker.e-device.e-popup .e-range-header {
    margin: 0;
    padding: 4rem 1.6rem;
  }

  .e-bigger .e-daterangepicker.e-popup .e-range-header .e-start-end .e-start-btn, .e-bigger .e-daterangepicker.e-popup .e-range-header .e-start-end .e-end-btn, *.e-bigger.e-daterangepicker.e-popup .e-range-header .e-start-end .e-start-btn, *.e-bigger.e-daterangepicker.e-popup .e-range-header .e-start-end .e-end-btn, *.e-device.e-daterangepicker.e-popup .e-range-header .e-start-end .e-start-btn, *.e-device.e-daterangepicker.e-popup .e-range-header .e-start-end .e-end-btn {
    border: 0;
    color: white;
    background: transparent;

    &:disabled:after {
      background: transparent;
    }
  }

  .e-btn.e-flat.e-primary:disabled, .e-css.e-btn.e-flat.e-primary:disabled {
    background: transparent;
  }

  .e-input-group .e-clear-icon, .e-input-group.e-control-wrapper .e-clear-icon,
  .e-daterangepicker.e-popup .e-day-span, .e-bigger.e-small .e-daterangepicker.e-popup .e-day-span {
    display: none;
  }
  
  .e-calendar .e-content td.e-focused-date.e-today span.e-day, .e-bigger.e-small .e-calendar .e-content td.e-focused-date.e-today span.e-day {
    background: transparent;
    border-color: ${({ theme }) => theme.colors.primary.brand};
  }
  
  .e-daterangepicker.e-popup,
  .e-bigger.e-small .e-daterangepicker.e-popup {
    &.calendar {
      border-radius: .8rem;
      
      .e-calendar .e-content th,
      .e-calendar .e-content td,
      .e-bigger.e-small .e-calendar .e-content th,
      .e-bigger.e-small .e-calendar .e-content td {
        border: 0;
      }
    }
  }

  .e-daterangepicker.e-popup .e-footer,
  .e-bigger.e-small .e-daterangepicker.e-popup .e-footer {
    border-bottom-left-radius: .8rem;
    border-bottom-right-radius: .8rem;
  }

  .calendar .e-calendar .e-content td.e-today.e-selected span.e-day,
  .calendar .e-bigger.e-small .e-calendar .e-content td.e-today.e-selected span.e-day {
    border: 0;
    background: ${({ theme }) => theme.colors.primary.brand};
    box-shadow: none;
  }
  
  .e-daterangepicker.e-popup .e-calendar .e-end-date.e-selected.e-range-hover span.e-day, .e-daterangepicker.e-popup .e-calendar .e-start-date.e-selected.e-range-hover span.e-day, .e-bigger.e-small .e-daterangepicker.e-popup .e-calendar .e-end-date.e-selected.e-range-hover span.e-day, .e-bigger.e-small .e-daterangepicker.e-popup .e-calendar .e-start-date.e-selected.e-range-hover span.e-day,
  .e-calendar .e-content td.e-selected span.e-day, .e-bigger.e-small .e-calendar .e-content td.e-selected span.e-day,
  .e-calendar .e-content td.e-today.e-selected:hover span.e-day, .e-calendar .e-content td.e-selected:hover span.e-day, .e-calendar .e-content td.e-selected.e-focused-date span.e-day, .e-bigger.e-small .e-calendar .e-content td.e-today.e-selected:hover span.e-day, .e-bigger.e-small .e-calendar .e-content td.e-selected:hover span.e-day, .e-bigger.e-small .e-calendar .e-content td.e-selected.e-focused-date span.e-day,
  .e-daterangepicker.e-popup .e-calendar .e-start-date.e-selected.e-range-hover.e-today span.e-day, .e-bigger.e-small .e-daterangepicker.e-popup .e-calendar .e-start-date.e-selected.e-range-hover.e-today span.e-day {
    background: ${({ theme }) => theme.colors.primary.brand};
  }
  
  .e-calendar .e-content td.e-today span.e-day, .e-calendar .e-content td.e-focused-date.e-today span.e-day, .e-bigger.e-small .e-calendar .e-content td.e-today span.e-day, .e-bigger.e-small .e-calendar .e-content td.e-focused-date.e-today span.e-day,
  .e-daterangepicker.e-popup .e-calendar .e-content.e-month .e-today.e-range-hover span, .e-bigger.e-small .e-daterangepicker.e-popup .e-calendar .e-content.e-month .e-today.e-range-hover span {
    border-color: ${({ theme }) => theme.colors.primary.brand};
    color: ${({ theme }) => theme.colors.primary.brand};
  }

  .e-daterangepicker.e-popup .e-calendar .e-range-hover.e-today:hover span.e-day, .e-daterangepicker.e-popup .e-calendar .e-range-hover.e-focused-date.e-today span.e-day, .e-daterangepicker.e-popup .e-calendar .e-range-hover.e-start-date.e-selected.e-today span.e-day, .e-daterangepicker.e-popup .e-calendar .e-range-hover.e-end-date.e-selected.e-today span.e-day, .e-bigger.e-small .e-daterangepicker.e-popup .e-calendar .e-range-hover.e-today:hover span.e-day, .e-bigger.e-small .e-daterangepicker.e-popup .e-calendar .e-range-hover.e-focused-date.e-today span.e-day, .e-bigger.e-small .e-daterangepicker.e-popup .e-calendar .e-range-hover.e-start-date.e-selected.e-today span.e-day, .e-bigger.e-small .e-daterangepicker.e-popup .e-calendar .e-range-hover.e-end-date.e-selected.e-today span.e-day {
    border: 0;
  }

  .e-date-range-wrapper .e-input-group-icon.e-icons.e-active,
  .e-btn.e-flat.e-primary, .e-css.e-btn.e-flat.e-primary,
  .e-input-group:not(.e-disabled) .e-input-group-icon:hover, .e-input-group.e-control-wrapper:not(.e-disabled) .e-input-group-icon:hover {
    color: ${({ theme }) => theme.colors.primary.brand};
  }

  .e-btn.e-flat, .e-css.e-btn.e-flat {
    color: ${({ theme }) => theme.colors.text.lightGray};
  }

  // 底線
  .e-input-group:not(.e-float-icon-left):not(.e-float-input)::before, .e-input-group:not(.e-float-icon-left):not(.e-float-input)::after, .e-input-group.e-float-icon-left:not(.e-float-input) .e-input-in-wrap::before, .e-input-group.e-float-icon-left:not(.e-float-input) .e-input-in-wrap::after, .e-input-group.e-control-wrapper:not(.e-float-icon-left):not(.e-float-input)::before, .e-input-group.e-control-wrapper:not(.e-float-icon-left):not(.e-float-input)::after, .e-input-group.e-control-wrapper.e-float-icon-left:not(.e-float-input) .e-input-in-wrap::before, .e-input-group.e-control-wrapper.e-float-icon-left:not(.e-float-input) .e-input-in-wrap::after {
    background: ${({ theme }) => theme.colors.primary.light};
  }

  .e-daterangepicker.e-popup .e-calendar .e-end-date.e-selected.e-range-hover span.e-day, .e-daterangepicker.e-popup .e-calendar .e-start-date.e-selected.e-range-hover span.e-day, .e-bigger.e-small .e-daterangepicker.e-popup .e-calendar .e-end-date.e-selected.e-range-hover span.e-day, .e-bigger.e-small .e-daterangepicker.e-popup .e-calendar .e-start-date.e-selected.e-range-hover span.e-day {
    color: white;
  }

  // calendar icon
  .e-input-group .e-input-group-icon, .e-input-group.e-control-wrapper .e-input-group-icon {
    width: 3.5rem;
    border-color: ${({ theme }) => theme.colors.primary.light};
    color: ${({ theme }) => theme.colors.primary.light};
  }

  .e-input-group:not(.e-success):not(.e-warning):not(.e-error):not(.e-float-icon-left), .e-input-group.e-float-icon-left:not(.e-success):not(.e-warning):not(.e-error) .e-input-in-wrap, .e-input-group.e-control-wrapper:not(.e-success):not(.e-warning):not(.e-error):not(.e-float-icon-left), .e-input-group.e-control-wrapper.e-float-icon-left:not(.e-success):not(.e-warning):not(.e-error) .e-input-in-wrap, .e-float-input.e-float-icon-left:not(.e-success):not(.e-warning):not(.e-error) .e-input-in-wrap, .e-float-input.e-control-wrapper.e-float-icon-left:not(.e-success):not(.e-warning):not(.e-error) .e-input-in-wrap {
    margin-bottom: 0;
    height: 4rem;
  }

  .e-input-group .e-input[readonly], .e-input-group.e-control-wrapper .e-input[readonly], .e-float-input input[readonly], .e-float-input.e-control-wrapper input[readonly], .e-float-input textarea[readonly], .e-float-input.e-control-wrapper textarea[readonly] {
    color: ${({ theme }) => theme.colors.primary.light};
  }
  
  .e-input-group input.e-input, .e-input-group.e-control-wrapper input.e-input, .e-input-group textarea.e-input, .e-input-group.e-control-wrapper textarea.e-input {
    padding: 6px 0 7px;
    font-size: 1.6rem;
    color: ${({ theme }) => theme.colors.primary.light};

    &::placeholder {
      color: ${({ theme }) => theme.colors.text.placeholder};
      opacity: 1;
    }
  }
  
  .e-input-group-icon.e-range-icon::before, *.e-control-wrapper .e-input-group-icon.e-range-icon::before {
    content: 'today';
    font-family: 'Material Icons', sans-serif;
    font-size: 2.4rem;
  }
`;

export default GlobalStyles;
