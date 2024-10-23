import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import NavBar from '../../components/NavBar';
import NoNoteBackground from '../../components/NoNoteBackground';
import ProgressSteps from '../../components/ProgressSteps';

import { useRecoilState } from 'recoil';
import { currentStepState } from '../../recoil/StepStateAtom';
import { ChooseColorState } from '../../recoil/ChooseColorAtom';

import leftArrow from '../../assets/leftArrow.svg';
import rightArrow from '../../assets/rightArrow.svg';
import '../../pages/RaiseHover/style.scss';

interface Color {
  name: string;
  color: string;
  hoverClass: string;
  nextColor: string;
}

function ChooseColorPage() {
  const [currentStep, setCurrentStep] = useRecoilState(currentStepState);
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [, setSelectedButton] = useRecoilState(ChooseColorState);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentStep(3); // step3
  }, [setCurrentStep]);

  const nextStep = () => {
    navigate('/selectstyle');
  };

  const prevStep = () => {
    navigate('/textinput');
  };

  const colors: Color[] = [
    {
      name: 'RED',
      color: '#FF0000',
      nextColor: '#B45F5F',
      hoverClass: 'raise',
    },
    {
      name: 'ORANGE',
      color: '#FF7F00',
      nextColor: '#CDA277',
      hoverClass: 'raise',
    },
    {
      name: 'YELLOW',
      color: '#FFFF00',
      nextColor: '#D8D8AB',
      hoverClass: 'raise',
    },
    {
      name: 'GRAY',
      color: '#808080',
      nextColor: '#D8D2D2',
      hoverClass: 'raise',
    },
    {
      name: 'GREEN',
      color: '#00FF00',
      nextColor: '#B7D6B1',
      hoverClass: 'raise',
    },
    {
      name: 'BLUE',
      color: '#0000FF',
      nextColor: '#8383D7',
      hoverClass: 'raise',
    },
    {
      name: 'PINK',
      color: '#FF1493',
      nextColor: '#E58CDA',
      hoverClass: 'raise',
    },
    {
      name: 'AQUA',
      color: '#00FFFF',
      nextColor: '#C7E4E4',
      hoverClass: 'raise',
    },
    {
      name: 'PURPLE',
      color: '#800080',
      nextColor: '#D2C0D2',
      hoverClass: 'raise',
    },
    {
      name: 'WHITE',
      color: '#FFFFFF',
      nextColor: '#DFDBDB',
      hoverClass: 'raise',
    },
    {
      name: 'BLACK',
      color: '#000000',
      nextColor: '#888181',
      hoverClass: 'raise',
    },
    {
      name: 'RANDOM',
      nextColor:
        'linear-gradient(100deg, #B20000 7.13%, #CCB300 21.06%, #0B6 43.01%, #0CCC 59.9%, #0033B2 74.68%, #B200B2 91.57%)',
      color:
        ' linear-gradient(100deg, #F00 7.13%, #FFE500 21.06%, #0F6 43.01%, #0FF 59.9%, #0038FF 74.68%, #FA00FF 91.57%)',
      hoverClass: 'raise',
    },
  ];

  const handleButtonClick = (color: string, nextColor: string) => {
    setActiveColor(color);
    setSelectedButton(nextColor);
  };

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-black bg-cover">
      <div className="relative h-full w-full">
        <NoNoteBackground>
          <NavBar />
          <div>
            <div className="mt-20">
              <ProgressSteps currentStep={currentStep} />
            </div>
            <div className="relative flex flex-col items-center justify-center text-center">
              <p className="mb-8 text-3xl text-white">
                원하는 색상을 선택해주세요!
              </p>

              <div className="grid grid-cols-4 gap-5">
                {colors.map(({ name, color, hoverClass, nextColor }) => {
                  const isWhite = name === 'WHITE' || name === 'YELLOW';
                  const isRandom = name === 'RANDOM';
                  const buttonStyle: React.CSSProperties = {
                    '--c': color,
                    background: isRandom ? color : color,
                    backgroundColor: color,
                    color: isWhite ? 'black' : 'white',
                    ...(activeColor === name && {
                      background: nextColor,
                      color: 'black',
                    }),
                  } as React.CSSProperties;
                  return (
                    <button
                      key={name}
                      className={`relative flex h-[7rem] w-[14rem] items-center justify-center rounded-xl text-[1.3rem] text-white transition-colors duration-300 ${hoverClass}`}
                      style={buttonStyle}
                      onClick={() => handleButtonClick(name, nextColor)}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
              <div className="mt-8 flex w-full justify-between">
                <button
                  type="button"
                  onClick={() => {
                    prevStep();
                  }}
                  className="font-['Cafe24 Danjunghae'] flex h-[5rem] w-[12.5rem] justify-center text-center text-3xl font-normal text-white hover:text-bermuda"
                >
                  <img
                    className="h-[2.5rem] w-[2.5rem]"
                    src={leftArrow}
                    alt="이전"
                  />
                  <p>이전</p>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    nextStep();
                  }}
                  className="font-['Cafe24 Danjunghae'] flex h-[5rem] w-[12.5rem] justify-center text-center text-3xl font-normal text-white hover:text-bermuda"
                >
                  다음
                  <img
                    className="h-[2.5rem] w-[2.5rem]"
                    src={rightArrow}
                    alt="다음"
                  />
                </button>
              </div>
            </div>
          </div>
        </NoNoteBackground>
      </div>
    </div>
  );
}

export default ChooseColorPage;
