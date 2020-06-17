import {atom} from 'recoil';

import {Attendee} from '../typings/data';

export const contactState = atom<null | Attendee[]>({
  key: 'contactState',
  default: null,
});
