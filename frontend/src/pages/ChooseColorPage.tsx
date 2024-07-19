// ChooseColorPage.tsx

import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import StyleButton from '../components/StyleButton2'; // StyleButton2로 수정
import { Link } from 'react-router-dom';
import MoveButton from '../components/MoveButton.tsx';
import { useRecoilState } from 'recoil';
import { ChooseColorState } from '../recoil/ChooseColorAtom.ts';

function ChooseColorPage() {
  const [selectedButton, setSelectedButton] =
    useRecoilState<string>(ChooseColorState);
  const [isButtonClicked, setIsButtonClicked] = useState(false); // 버튼 클릭 상태를 관리하는 상태를 추가합니다.

  const handleSubmit = (event) => {
    event.preventDefault(); // 폼 제출의 기본 동작을 막습니다.
    console.log('입력된 텍스트:', selectedButton);
    setIsButtonClicked(true); // 버튼이 클릭되었음을 표시합니다.
    // 여기에 다음 버튼을 클릭했을 때 실행할 코드를 추가하세요.
    // 예를 들어, 다음 페이지로 이동하거나, 서버에 데이터를 전송하는 등의 작업을 수행할 수 있습니다.
  };
  const toggleButton = (color: string) => {
    setSelectedButton(color);
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
            <form onSubmit={handleSubmit}>
              {''}
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
            </form>
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
