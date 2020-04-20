import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {RouteProp, CompositeNavigationProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {
  User,
  CheckedinAttendee,
  CheckinList,
  Speaker,
  Talk,
  Schedule,
  Attendee,
} from '../data/data';

/** App */

export type AppStackParamList = {
  Home: undefined;
  AttendeeDetail: Attendee;
  TicketInstructions: {ticket: User};
  CheckedInAttendeeInfo: {checkedInAttendee: CheckedinAttendee};
  QRScanner: {uuid: string} | undefined;
  QRCheckinScanner: {uuid: string; checkinList: CheckinList};
  QRContactScanner: undefined;
  StaffCheckinLists: undefined;
  Details: {speaker: Speaker; talk: Talk; scheduleSlot: Schedule};
};

export type AppRouteProp<T extends keyof AppStackParamList> = RouteProp<
  AppStackParamList,
  T
>;

export type AppNavigationProp<
  T extends keyof AppStackParamList
> = StackNavigationProp<AppStackParamList, T>;

export type AppProps<T extends keyof AppStackParamList> = {
  route: AppRouteProp<T>;
  navigation: AppNavigationProp<T>;
};

/** Profile */

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
