import {Dimensions, Platform} from 'react-native';
// @ts-ignore
import {GQL_URI, GQL_SLUG} from 'react-native-dotenv';

const X_WIDTH = 375;
const X_HEIGHT = 812;
const {height: D_HEIGHT, width: D_WIDTH} = Dimensions.get('window');
const isIPhoneX =
  Platform.OS === 'ios' && D_HEIGHT === X_HEIGHT && D_WIDTH === X_WIDTH;
const notchHeight = isIPhoneX ? 20 : 0;

const isSmallDevice = D_WIDTH < 326;

export const Layout = {
  window: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  notchHeight,
  isSmallDevice,
};

export const Colors = {
  blue: '#4d5fab',
  faint: '#7a7a7a',
};

export const Icons = {
  favorite: `ios-bookmark-outline`,
  favoriteActive: `ios-bookmark`,
};

export const FontSizes = {
  sm: isSmallDevice ? 12 : 14,
  md: isSmallDevice ? 14 : 16,
  lg: isSmallDevice ? 16 : 18,
  xl: isSmallDevice ? 18 : 20,
};

export const GQL = {
  uri: GQL_URI,
  slug: GQL_SLUG,
  // uri: "http://192.168.1.32:4449/gql",
  //    uri: "https://a6bb05ac.ngrok.io",
  //    slug: "cluster-test"
};
