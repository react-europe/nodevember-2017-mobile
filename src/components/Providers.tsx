import React from 'react';
import {ApolloProvider} from 'react-apollo';
import {Provider as PaperProvider} from 'react-native-paper';

import theme from '../constants/theme';
import client from '../utils/gqlClient';

export default function Providers({children}: {children: React.ReactNode}) {
  return (
    <ApolloProvider client={client}>
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </ApolloProvider>
  );
}
