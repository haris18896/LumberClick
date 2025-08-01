// import {useSelector} from 'react-redux';

const DefaultPalette = () => {
  // const {theme} = useSelector(state => state.settings);

  // ** Vars
  const whiteColor = '#FFF';
  const lightColor = '255, 255, 255';
  const darkColor = '75, 75, 75';
  const mainColor = lightColor;

  return {
    customColors: {
      white: '#fff',
      dark: darkColor,
      main: mainColor,
      darkBg: '#7F909F',
      light: lightColor,
      lightBg: lightColor,
      bodyBg: '#eaf0fe',
      trackBg: '#F2F2F4',
      tooltipBg: '#262732',
      tableHeaderBg: '#F5F5F7',
    },
    common: {
      black: '#000',
      white: whiteColor,
      bottomBarBG: '#FC8019',
      switch: '#243070',
      gray: '#FAFAFA',
      gold: '#FFD700',
    },
    primary: {
      light: '#006CEA4D',
      main: '#006CEA',
      dark: '#024696',
    },
    secondary: {
      lightBG: 'rgba(44, 42, 110, 0.2)',
      light: '#DBB5704D',
      main: '#DBB570',
      dark: '#966203',
    },
    error: {
      lightBG: 'rgba(237, 30, 36, 0.2)',
      light: '#EA54554D',
      main: '#EA5455',
      dark: '#D80F24',
    },
    warning: {
      lightBG: 'rgba(253, 181, 40, 0.2)',
      light: '#FF9F434D',
      main: '#FF9F43',
      dark: '#DF9F23',
    },
    info: {
      lightBG: 'rgba(38, 198, 249, 0.2)',
      light: '#00CFE84D',
      main: '#00CFE8',
      dark: '#21AEDB',
    },
    success: {
      lightBG: 'rgba(54, 180, 130, 0.2)',
      light: '#28C76F4D',
      main: '#8cc63e',
      dark: '#278a62',
    },
    badges: {
      green: '#36B482',
      red: '#ED1E24',
    },
    linearGradient: {
      gold: ['#F6A113', '#F6DF69'],
      black: ['#1E1E1E', '#4F4F4F'],
    },
    grey: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
      A100: '#F5F5F5',
      A200: '#EEEEEE',
      A400: '#BDBDBD',
      A700: '#616161',
      arrow: '#0D120E',
      light: '#1E1E1E',
      dark: '#BABFC7',
      greyText: '#7f909f',
    },
    borders: {
      inputBorder: '#E8E8E8',
      borderSelected: '#ED1E24',
    },
    text: {
      // text: theme === 'light' ? '#000' : '#fff',
      text: `rgba(${darkColor}, 1)`,
      white: '#fefefe',
      primary: '#767676',
      secondary: '#243070',
      disabled: '#BABFC7',
      grey: '#77838F',
      lightGrey: '#ECECEC',
      title: '#4B4B4B',
    },
    card: {
      primary: '#f2f9ff',
      secondary: '#fcfaf5',
    },
    divider: 'rgba(236, 236, 236, 0.5)',
    background: {
      paper: '#EBEDEE',
      inputBG: '#F7F7F7',
      table: '#28388F',
      paperGrey: '#E5E9EC',
      backdrop: 'rgba(0, 0, 0, 0.2)',
      bottomTab: '#FFC279',
    },
    buttons: {
      primary: '#006CEA',
      secondary: '#DBB570',
    },
    labels: {
      primaryLabel: '#8C8C8C',
      secondaryLabel: '#56565E',
    },
    action: {
      active: `rgba(${mainColor}, 0.54)`,
      hover: `rgba(${mainColor}, 0.05)`,
      hoverOpacity: 0.05,
      selected: `rgba(${mainColor}, 0.08)`,
      disabled: `rgba(${mainColor}, 0.26)`,
      disabledBackground: `rgba(${mainColor}, 0.12)`,
      focus: `rgba(${mainColor}, 0.12)`,
    },
    shadow: {
      color: '#707070',
      paper: '#000',
    },
    skeleton: {
      backgroundColor: '#bdbdbd',
      highlightColor: '#e0e0e0',
    },
  };
};

export default DefaultPalette;
