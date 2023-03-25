const theme = {
  // font: '-apple-system, "Mulish", "Noto Sans TC", "Microsoft JhengHei", "微軟正黑體", sans-serif',
  font: '-apple-system, "Roboto", "Noto Sans TC", sans-serif',
  colors: {
    primary: {
      brand: '#825DC7',
      dark: '#5D2FB3',
      light: '#AC8DE8',
      lightest: '#F7F2FF',
      gradient: 'linear-gradient(0deg, rgba(96, 50, 181, 1) 0%, rgba(213, 190, 255, 1) 100%)',
    },
    secondary: {
      brand: '#93DA49',
      dark: '#81BC01',
    },
    basic: {
      white: '#FFF',
    },
    text: {
      white: '#FFF',
      darker: '#022B5A',
      dark: '#042C5C',
      light: '#6F89B2',
      darkGray: '#505050',
      lightGray: '#666',
      mediumGray: '#999',
      placeholder: '#CCC',
      link: '#3EC4EE',
      point: '#E60E0E',
    },
    border: {
      light: '#999',
      lighter: '#D7DCE2',
      lightest: '#F3F3F3',
    },
    background: {
      light: '#E9EBEE',
      lightBlue: '#D8E0ED',
      lighter: '#F5F5F5',
      lighterBlue: '#F3F5FC',
      lightest: '#FFFEFD',
      lightness: '#CCC',
      star: '#FFD466',
      point: '#E60E0E',
      cancel: '#D8E0ED',
      disable: '#E9EBEE',
      mask: 'rgba(56, 31, 115, .5)',
    },
    state: {
      success: '#46D4A7',
      danger: '#FF5F5F',
      error: '#DA4949',
      selected: '#81BC01',
    },
    card: {
      purple: '#D8CAFB',
      pink: '#FDE3EC',
      yellow: '#F6EFC5',
      blue: '#D7EAF5',
      orange: '#FFE8DE',
      green: '#EDFFDD',
      empty: '#F3F5FC',
      lightPurple: '#FCEDFF',
    },
  },
  filters: {
    blur: '.4rem',
    shadow: '0 -.4rem .8rem rgba(0, 0, 0, .16)',
  },
  transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
};

export default theme;
