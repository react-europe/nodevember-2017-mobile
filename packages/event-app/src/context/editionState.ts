import {atom} from 'recoil';

export const editionState = atom<string>({
  key: 'editionState',
  default: 'reacteurope-2020',
});
