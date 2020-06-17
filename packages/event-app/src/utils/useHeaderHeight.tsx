import {useHeaderHeight as useHeaderHeightNav} from '@react-navigation/stack';
import {Platform} from 'react-native';

import {Layout} from '../constants';

function useHeaderHeight(): number {
  const headerHeight = useHeaderHeightNav();
  return Platform.OS === 'android'
    ? headerHeight
    : headerHeight + Layout.notchHeight;
}

export default useHeaderHeight;
