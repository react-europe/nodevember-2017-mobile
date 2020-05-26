const linkingConfig = {
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
        Menu: {
          initialRouteName: 'Menu',
          screens: {
            Menu: 'menu',
            Speakers: 'menu/speakers',
            Crew: 'menu/crew',
            Sponsors: 'menu/sponsors',
            Attendees: 'menu/attendees',
            AttendeeDetail: 'menu/attendees-details',
          },
        },
      },
    },
  },
};

export default linkingConfig;
