import { atom } from 'recoil';

export const businessInputState = atom({
  key: 'businessInputState', // 고유한 ID (with respect to other atoms/selectors)
  default: [], // 기본값
});