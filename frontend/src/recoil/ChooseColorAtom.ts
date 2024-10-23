import { atom } from 'recoil';

export const ChooseColorState = atom<string>({
  key: 'ChooseColorState',
  default: '',
});
