import {DefaultTheme, Theme, configureFonts} from 'react-native-paper';

export const mediaQuery = {
  maxDeviceWidth: 1224,
  query: '(max-device-width: 1224px)',
};

const fontConfig = {
  default: {
    regular: {
      fontFamily: 'open-sans',
    },
    medium: {
      fontFamily: 'open-sans-bold',
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
    accent: '#FFF',
    text: '#000',
  },
  fonts: configureFonts(fontConfig),
};

export default theme;
