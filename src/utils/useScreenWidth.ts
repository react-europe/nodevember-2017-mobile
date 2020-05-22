import {useMediaQuery} from 'react-responsive';

import {mediaQuery} from '../constants/theme';

export default function useScreenWidth() {
  const isSmall = useMediaQuery(mediaQuery);

  return !isSmall;
}
