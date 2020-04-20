import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

export type ProfileStackParamList = {
  Profile: undefined;
};

type ProfileScreenRouteProp = RouteProp<ProfileStackParamList, 'Profile'>;

type ProfileScreenNavigationProp = StackNavigationProp<
  ProfileStackParamList,
  'Profile'
>;

export type ProfileProps = {
  route: ProfileScreenRouteProp;
  navigation: ProfileScreenNavigationProp;
};
