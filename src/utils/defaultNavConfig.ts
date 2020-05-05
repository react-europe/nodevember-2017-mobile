import theme from '../constants/theme';

function DefaultStackConfig(route: any) {
  return {
    cardStyle: {
      backgroundColor: '#fafafa',
    },
    title: route.name,
    headerStyle: {
      borderBottomWidth: 0,
      shadowRadius: 0,
      backgroundColor: theme.colors.primary,
    },
    headerTintColor: theme.colors.accent,
    headerTitleStyle: {
      fontFamily: 'open-sans-bold',
    },
  };
}

export default DefaultStackConfig;
