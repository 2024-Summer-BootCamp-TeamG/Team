import styled, { keyframes, css } from 'styled-components';
import React from 'react';

type ProgressStepsProps = {
  currentStep: number;
};

type StarProps = {
  active: boolean;
};

const steps = [1, 2, 3, 4];

const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep }) => {
  return (
    <Container>
      <Line currentStep={currentStep} />
      {steps.map((step) => (
        <Star key={step} active={step <= currentStep} />
      ))}
    </Container>
  );
};

export default ProgressSteps;

// const progressAnimation = keyframes`
//   0% { width: 0; }
//   100% { width: 100%; }
// `;

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  margin: 20px 0;
  width: 100%;
  height: 20px; /* Adjusted to fit the stars */
`;

export const Line = styled.div<{ currentStep: number }>`
  position: absolute;
  top: 50%;
  left: 0;
  height: 2px;
  background: linear-gradient(to right, #0f0f0f, #c3bfbf);
  z-index: 1;
  width: ${(props) => (props.currentStep - 1) * 33.33}%;
  transition: width 0.3s;
`;

const glow = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(0, 0, 255, 0.2);
  }
  50% {
    box-shadow: 0 0 20px rgba(0, 0, 255, 0.8);
  }
  100% {
    box-shadow: 0 0 5px rgba(0, 0, 255, 0.2);
  }
`;

export const Star = styled.div<StarProps>`
  position: relative;
  z-index: 2;
  background-color: ${(props) => (props.active ? '#B843B1' : '#ccc')};
  width: ${(props) => (props.active ? '15px' : '10px')};
  height: ${(props) => (props.active ? '15px' : '10px')};
  border-radius: 50%;
  transition:
    background-color 0.3s,
    width 0.3s,
    height 0.3s;

  ${(props) =>
    props.active &&
    css`
      animation: ${glow} 1s infinite alternate;
    `}

  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 255, 0.2);
    opacity: ${(props) => (props.active ? 1 : 0)};
    transition: opacity 0.3s;
  }
`;
