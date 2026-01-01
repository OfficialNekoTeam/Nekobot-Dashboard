// ==============================|| DEFAULT THEME COLORS ||============================== //

interface DefaultColor {
  // paper & background
  paper: string;

  // primary
  primaryLight: string;
  primary200: string;
  primaryMain: string;
  primaryDark: string;
  primary800: string;

  // secondary
  secondaryLight: string;
  secondary200: string;
  secondaryMain: string;
  secondaryDark: string;
  secondary800: string;

  // success
  successLight: string;
  success200: string;
  successMain: string;
  successDark: string;

  // error
  errorLight: string;
  errorMain: string;
  errorDark: string;

  // orange
  orangeLight: string;
  orangeMain: string;
  orangeDark: string;

  // warning
  warningLight: string;
  warningMain: string;
  warningDark: string;

  // grey
  grey50: string;
  grey100: string;
  grey200: string;
  grey300: string;
  grey500: string;
  grey600: string;
  grey700: string;
  grey900: string;

  // ==============================|| DARK THEME VARIANTS ||============================== //

  // paper & background
  darkPaper: string;
  darkBackground: string;

  // dark 800 & 900
  darkLevel1: string;
  darkLevel2: string;

  // text variants
  darkTextTitle: string;
  darkTextPrimary: string;
  darkTextSecondary: string;

  // primary dark
  darkPrimaryLight: string;
  darkPrimaryMain: string;
  darkPrimaryDark: string;
  darkPrimary200: string;
  darkPrimary800: string;

  // secondary dark
  darkSecondaryLight: string;
  darkSecondaryMain: string;
  darkSecondaryDark: string;
  darkSecondary200: string;
  darkSecondary800: string;
}

const defaultColor: DefaultColor = {
  // paper & background
  paper: '#ffffff',

  // primary
  primaryLight: '#e3f2fd',
  primary200: '#90caf9',
  primaryMain: '#2196f3',
  primaryDark: '#1e88e5',
  primary800: '#1565c0',

  // secondary
  secondaryLight: '#ede7f6',
  secondary200: '#b39ddb',
  secondaryMain: '#673ab7',
  secondaryDark: '#5e35b1',
  secondary800: '#4527a0',

  // success
  successLight: '#b9f6ca',
  success200: '#69f0ae',
  successMain: '#00e676',
  successDark: '#00c853',

  // error
  errorLight: '#ef9a9a',
  errorMain: '#f44336',
  errorDark: '#c62828',

  // orange
  orangeLight: '#fbe9e7',
  orangeMain: '#ffab91',
  orangeDark: '#d84315',

  // warning
  warningLight: '#fff8e1',
  warningMain: '#ffe57f',
  warningDark: '#ffc107',

  // grey
  grey50: '#f8fafc',
  grey100: '#eef2f6',
  grey200: '#e3e8ef',
  grey300: '#cdd5df',
  grey500: '#697586',
  grey600: '#4b5563',
  grey700: '#364152',
  grey900: '#121926',

  // ==============================|| DARK THEME VARIANTS ||============================== //

  // paper & background
  darkPaper: '#111936',
  darkBackground: '#1a223f',

  // dark 800 & 900
  darkLevel1: '#29314f',
  darkLevel2: '#212946',

  // text variants
  darkTextTitle: '#d7dcec',
  darkTextPrimary: '#bdc8f0',
  darkTextSecondary: '#8492c4',

  // primary dark
  darkPrimaryLight: '#e3f2fd',
  darkPrimaryMain: '#2196f3',
  darkPrimaryDark: '#1e88e5',
  darkPrimary200: '#90caf9',
  darkPrimary800: '#1565c0',

  // secondary dark
  darkSecondaryLight: '#d1c4e9',
  darkSecondaryMain: '#7c4dff',
  darkSecondaryDark: '#651fff',
  darkSecondary200: '#b39ddb',
  darkSecondary800: '#6200ea'
};

export default defaultColor;