import React from 'react';
import CachedImage from './CachedImage';
import md5 from 'crypto-js/md5';

export default class GravatarImage extends React.PureComponent {
  render() {
    let gravatarUrl = `https://www.gravatar.com/avatar/${md5(
      this.props.email
    )}?s=200`;

    return <CachedImage source={{uri: gravatarUrl}} style={this.props.style} />;
  }
}
