import React from 'react';
import {createContext} from 'react';

const DataContext = createContext({
  initialLinkingUri: '',
  event: {},
});

export function withData(Component) {
  return function WrappedWithData(props) {
    return (
      <DataContext.Consumer>
        {data => <Component {...props} {...data} />}
      </DataContext.Consumer>
    );
  };
}

export default DataContext;
