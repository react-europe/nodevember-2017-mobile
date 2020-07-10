import {atom} from 'recoil';

export const adminTokenState = atom<null | {
  token: string | null;
  edition: string;
}>({
  key: 'adminTokenState',
  default: null,
});
