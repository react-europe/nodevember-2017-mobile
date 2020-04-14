import React from 'react';
import CachedImage from './CachedImage';
import md5 from 'crypto-js/md5';

export default function GravatarImage(props) {
  let gravatarUrl = `https://www.gravatar.com/avatar/${md5(props.email)}?s=200`;

  return <CachedImage source={{uri: gravatarUrl}} style={props.style} />;
}
