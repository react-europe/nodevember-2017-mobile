import {DefaultTheme, Theme, configureFonts} from 'react-native-paper';

const fontConfig = {
  default: {
    regular: {
      fontFamily: 'open-sans-semibold',
    },
    medium: {
      fontFamily: 'open-sans-semibold',
    },
    light: {
      fontFamily: 'open-sans-semibold',
    },
    thin: {
      fontFamily: 'open-sans-semibold',
    },
  },
};

const theme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4d5fab',
    text: '#FFFFFF',
  },
  fonts: configureFonts(fontConfig),
};

export default theme;
