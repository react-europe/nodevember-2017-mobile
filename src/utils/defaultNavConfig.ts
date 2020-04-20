import {Colors} from '../constants';
import {ProfileScreenRouteProp} from '../navigation/types';

function DefaultStackConfig(route: ProfileScreenRouteProp) {
  return {
    cardStyle: {
      backgroundColor: '#fafafa',
    },
    title: route.name,
    headerStyle: {
      borderBottomWidth: 0,
      shadowRadius: 0,
      backgroundColor: Colors.blue,
    },
    headerTintColor: 'white',
    headerTitleStyle: {
      fontFamily: 'open-sans-bold',
    },
  };
}

export default DefaultStackConfig;
