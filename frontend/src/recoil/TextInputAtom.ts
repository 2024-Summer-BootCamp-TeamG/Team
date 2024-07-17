import { atom } from 'recoil';

export const textInputState = atom({
  key: 'textInputState', // 고유한 ID (with respect to other atoms/selectors)
  default: '', // 기본값
});
