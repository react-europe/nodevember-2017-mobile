const linkingConfig = {
  enabled: true,
  prefixes: [],
  config: {
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
