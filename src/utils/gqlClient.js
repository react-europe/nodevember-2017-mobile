import {Client} from 'urql';
import {GQL} from '../constants';

const client = new Client({
  url: GQL.uri,
});

export default client;
