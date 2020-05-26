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
          path: 'menu',
          screens: {
            Menu: 'menu',
            Speakers: 'speakers',
            Crew: 'crew',
            Sponsors: 'sponsors',
            Attendees: 'attendees',
            AttendeeDetail: 'attendees-details',
          },
        },
      },
    },
  },
};

export default linkingConfig;
