import {useEffect, useState} from 'react';
import {Dimensions, ScaledSize} from 'react-native';

export function useCurrentScreenWidth() {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const onDimensionsChange = ({window}: {window: ScaledSize}) => {
      setDimensions(window);
    };
    Dimensions.addEventListener('change', onDimensionsChange);
    return () => Dimensions.removeEventListener('change', onDimensionsChange);
  }, []);

  return dimensions;
}

export function checkSmallScreen() {
  const dimensions = useCurrentScreenWidth();
  return dimensions.width <= 640;
}

export function checkMediumScreen() {
  const dimensions = useCurrentScreenWidth();
  return dimensions.width > 640 && dimensions.width < 1024;
}

export function checkLargeScreen() {
  const dimensions = useCurrentScreenWidth();
  return dimensions.width >= 1024;
}
