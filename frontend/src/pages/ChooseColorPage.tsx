// ChooseColorPage.tsx

import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import StyleButton from '../components/StyleButton2'; // StyleButton2로 수정
import { Link } from 'react-router-dom';
import MoveButton from '../components/MoveButton.tsx';
import { useRecoilState } from 'recoil';
import { ChooseColorState } from '../recoil/ChooseColorAtom.ts';

function ChooseColorPage() {
  const [selectedButton, setSelectedButton] = useRecoilState<string>('');

  const toggleButton = (buttonText: string) => {
    setSelectedButton((prevSelected) =>
      prevSelected === buttonText ? '' : buttonText,
    );
  };

  const getButtonStyle = (color: string) => ({
    backgroundColor:
      selectedButton === color ? color.toLowerCase() : 'transparent',
  });

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-black bg-cover">
      <div className="relative h-full w-full">
        <NavBar />
        <div className="mt-56 flex items-center justify-center text-center text-4xl text-white">
          원하는 색상을 선택해주세요!
        </div>

        <div className="relative top-14 flex flex-col items-center justify-center text-center">
          <div className="grid grid-cols-4 gap-9">
            <StyleButton
              className="h-[9rem] w-[20rem]"
              buttonText="RED"
              isSelected={selectedButton === 'RED'}
              onToggle={() => toggleButton('RED')}
              style={getButtonStyle('RED')}
            />
            <StyleButton
              className="h-[9rem] w-[20rem]"
              buttonText="ORANGE"
              isSelected={selectedButton === 'ORANGE'}
              onToggle={() => toggleButton('ORANGE')}
              style={getButtonStyle('ORANGE')}
            />
            <StyleButton
              className="h-[9rem] w-[20rem]"
              buttonText="YELLOW"
              isSelected={selectedButton === 'YELLOW'}
              onToggle={() => toggleButton('YELLOW')}
              style={getButtonStyle('YELLOW')}
            />
            <StyleButton
              className="h-[9rem] w-[20rem]"
              buttonText="GRAY"
              isSelected={selectedButton === 'GRAY'}
              onToggle={() => toggleButton('GRAY')}
              style={getButtonStyle('GRAY')}
            />
            <StyleButton
              className="h-[9rem] w-[20rem]"
              buttonText="GREEN"
              isSelected={selectedButton === 'GREEN'}
              onToggle={() => toggleButton('GREEN')}
              style={getButtonStyle('GREEN')}
            />
            <StyleButton
              className="h-[9rem] w-[20rem]"
              buttonText="BLUE"
              isSelected={selectedButton === 'BLUE'}
              onToggle={() => toggleButton('BLUE')}
              style={getButtonStyle('BLUE')}
            />
            <StyleButton
              className="h-[9rem] w-[20rem]"
              buttonText="PINK"
              isSelected={selectedButton === 'PINK'}
              onToggle={() => toggleButton('PINK')}
              style={getButtonStyle('PINK')}
            />
            <StyleButton
              className="h-[9rem] w-[20rem]"
              buttonText="AQUA"
              isSelected={selectedButton === 'AQUA'}
              onToggle={() => toggleButton('AQUA')}
              style={getButtonStyle('AQUA')}
            />
            <StyleButton
              className="h-[9rem] w-[20rem]"
              buttonText="PURPLE"
              isSelected={selectedButton === 'PURPLE'}
              onToggle={() => toggleButton('PURPLE')}
              style={getButtonStyle('PURPLE')}
            />
            <StyleButton
              className="h-[9rem] w-[20rem]"
              buttonText="WHITE"
              isSelected={selectedButton === 'WHITE'}
              onToggle={() => toggleButton('WHITE')}
              style={getButtonStyle('WHITE')}
            />
            <StyleButton
              className="h-[9rem] w-[20rem]"
              buttonText="BLACK"
              isSelected={selectedButton === 'BLACK'}
              onToggle={() => toggleButton('BLACK')}
              style={getButtonStyle('BLACK')}
            />
            <StyleButton
              className="h-[9rem] w-[20rem]"
              buttonText="RANDOM"
              isSelected={selectedButton === 'RANDOM'}
              onToggle={() => toggleButton('RANDOM')}
              style={getButtonStyle('RANDOM')}
            />
          </div>
          <div className="mt-28 flex w-full justify-around">
            <Link to="/textinput">
              <MoveButton buttonText="이전" />
            </Link>

            <Link to="/selectstyle">
              <MoveButton buttonText="다음" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChooseColorPage;
