import {useEffect, useState} from 'react';
import {Dimensions, ScaledSize} from 'react-native';
import {useMediaQuery} from 'react-responsive';

import {mediaQuery} from '../constants/theme';

export default function useScreenWidth() {
  const isSmall = useMediaQuery(mediaQuery);

  return !isSmall;
}

export function useCurrentScreenWidth() {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const onDimensionsChange = ({window}: {window: ScaledSize}) => {
      setDimensions(window);
    };
    Dimensions.addEventListener('change', onDimensionsChange);
    return () => Dimensions.removeEventListener('change', onDimensionsChange);
  }, []);

  return dimensions.width >= 1024;
}
