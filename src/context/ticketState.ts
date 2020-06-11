import {atom} from 'recoil';

import {User} from '../typings/data';

export const ticketState = atom<null | User[]>({
  key: 'ticketState',
  default: null,
});
