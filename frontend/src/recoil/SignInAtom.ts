import { atom } from 'recoil';

export const SignInState = atom<string>({
  key: 'SignInState',
  default: false,
});
