import {Platform} from 'react-native';

export default function getLinkingConfig(isLargeScreen: boolean) {
  const drawerNav = Platform.OS === 'web' && isLargeScreen;
  return {
    enabled: true,
    prefixes: [],
    config: {
      Details: {
        path: 'details',
        parse: {
          scheduleId: (scheduleId: string) => JSON.parse(scheduleId),
          speakerId: (speakerId: string) => JSON.parse(speakerId),
        },
      },
      Home: {
        screens: {
          Home: '',
          Profile: {
            screens: {
              Profile: 'profile',
            },
          },
          Schedule: {
            screens: {
              Schedule: 'schedule',
            },
          },
          Contacts: {
            screens: {
              Contacts: 'contacts',
            },
          },
          ...(drawerNav && {
            Speakers: {
              screens: {
                Speakers: 'speakers',
              },
            },
            Sponsors: {
              screens: {
                Sponsors: 'sponsors',
              },
            },
            Attendees: {
              screens: {
                Attendees: 'attendees',
              },
            },
          }),
          ...(!drawerNav && {
            Menu: {
              initialRouteName: 'Menu',
              path: 'menu',
              screens: {
                Menu: '',
                Speakers: 'speakers',
                Crew: 'crew',
                Sponsors: 'sponsors',
                Attendees: 'attendees',
                AttendeeDetail: 'attendees-details',
              },
            },
          }),
        },
      },
    },
  };
}
