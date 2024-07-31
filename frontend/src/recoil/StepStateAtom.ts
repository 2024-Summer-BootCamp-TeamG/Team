// src/recoil/StepState.js
import { atom } from 'recoil';

export const currentStepState = atom({
  key: 'currentStepState', // unique ID (with respect to other atoms/selectors)
  default: 1, // default value (aka initial value)
});
