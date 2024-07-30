import styled from 'styled-components';
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
      <Line />
      {steps.map((step) => (
        <Star key={step} active={step <= currentStep} />
      ))}
    </Container>
  );
};

export default ProgressSteps;

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  margin: 20px 0;
`;

export const Line = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(to right, #d0cccc, #0f0f0f);
  z-index: 1;
`;

export const Star = styled.div<StarProps>`
  position: relative;
  z-index: 2;
  background-color: ${(props) => (props.active ? '#00f' : '#ccc')};
  width: ${(props) => (props.active ? '15px' : '10px')};
  height: ${(props) => (props.active ? '15px' : '10px')};
  border-radius: 50%;
  transition:
    background-color 0.3s,
    width 0.3s,
    height 0.3s;

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
