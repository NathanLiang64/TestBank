const theme = {
  font: '"Noto Sans TC", "Microsoft JhengHei", "微軟正黑體", sans-serif',
  colors: {
    primary: {
      brand: '#825DC7',
      dark: '#5D2FB3',
      light: '#AC8DE8',
      lightest: '#EADFF9',
    },
    secondary: {
      brand: '#93DA49',
      dark: '#81BC01',
    },
    basic: {
      white: '#FFF',
    },
    text: {
      darker: '#022B5A',
      dark: '#2C496D',
      light: '#718AB2',
      darkGray: '#656462',
      lightGray: '#787675',
      link: '#3EC4EE',
    },
    border: {
      light: '#777777',
      lighter: '#D7DCE2',
    },
    background: {
      primary: '#AC8DE8',
      light: '#E9EBEE',
      mask: 'rgba(130, 93, 199, .6)',
    },
    state: {
      success: '#46D4A7',
      danger: '#E88D8D',
    },
  },
  filters: {
    blur: '.4rem',
    shadow: '0 -.4rem .8rem rgba(0, 0, 0, .16)',
  },
  transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
};

export default theme;
