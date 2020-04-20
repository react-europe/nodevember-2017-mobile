import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

export type ProfileStackParamList = {
  Profile: undefined;
};

export type ProfileScreenRouteProp = RouteProp<
  ProfileStackParamList,
  'Profile'
>;

export type ProfileScreenNavigationProp = StackNavigationProp<
  ProfileStackParamList,
  'Profile'
>;

export type ProfileProps = {
  route: ProfileScreenRouteProp;
  navigation: ProfileScreenNavigationProp;
};
