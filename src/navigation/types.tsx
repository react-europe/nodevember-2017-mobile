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

/** Primary Tab */

export type PrimaryTabParamList = {
  Home: undefined;
  Profile: undefined;
  Schedule: undefined;
  Contacts: undefined;
  Menu: undefined;
};

export type PrimaryTabRouteProp<
  T extends keyof PrimaryTabParamList
> = RouteProp<PrimaryTabParamList, T>;

type PrimaryTabNavigationProp<
  T extends keyof PrimaryTabParamList
> = CompositeNavigationProp<
  BottomTabNavigationProp<PrimaryTabParamList, T>,
  StackNavigationProp<AppStackParamList>
>;

export type PrimaryTabProps<T extends keyof PrimaryTabParamList> = {
  route: PrimaryTabRouteProp<T>;
  navigation: PrimaryTabNavigationProp<T>;
};

/** Profile */

export type ProfileStackParamList = {
  Profile: undefined;
};

export type ProfileScreenRouteProp = RouteProp<
  ProfileStackParamList,
  'Profile'
>;

export type ProfileNavigationProp = CompositeNavigationProp<
  StackNavigationProp<PrimaryTabParamList, 'Profile'>,
  PrimaryTabNavigationProp<'Profile'>
>;

export type ProfileProps = {
  route: ProfileScreenRouteProp;
  navigation: ProfileNavigationProp;
};
