import React, { useState } from 'react';
import Background from '../components/Background.tsx';
import NavBar from '../components/NavBar.tsx';
import StyleButton from '../components/StyleButton.tsx';
import MoveButton from '../components/MoveButton.tsx';
import { Link } from 'react-router-dom';

// 스타일 선택 페이지
function SelectStylePage() {
  const [selectedButton, setSelectedButton] = useState<string>(''); // 선택된 버튼 상태

  // 특정 버튼의 선택 상태 토글 함수
  const toggleButton = (buttonText: string) => {
    setSelectedButton((prevSelected) =>
      prevSelected === buttonText ? '' : buttonText,
    );
  };
  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-[#000000] bg-cover">
      <div className="relative h-full w-full">
        <Background>
          <NavBar />
          <div className="w-auto flex-col items-center justify-center space-y-8">
            <div className="mx-auto flex w-3/4 flex-row justify-between space-x-12">
              <StyleButton
                className={`h-[9rem] w-[21rem] ${selectedButton === '모던한' ? 'selected' : ''}`}
                buttonText="모던한"
                isSelected={selectedButton === '모던한'}
                onToggle={() => toggleButton('모던한')}
              />
              <StyleButton
                className={`h-[9rem] w-[21rem] ${selectedButton === '장난스러운' ? 'selected' : ''}`}
                buttonText="장난스러운"
                isSelected={selectedButton === '장난스러운'}
                onToggle={() => toggleButton('장난스러운')}
              />
              <StyleButton
                className={`h-[9rem] w-[21rem] ${selectedButton === '재미난' ? 'selected' : ''}`}
                buttonText="재미난"
                isSelected={selectedButton === '재미난'}
                onToggle={() => toggleButton('재미난')}
              />
            </div>
            <div className="mx-auto flex w-auto flex-row justify-between space-x-4">
              <StyleButton
                className={`h-[9rem] w-[21rem] ${selectedButton === '간단한' ? 'selected' : ''}`}
                buttonText="간단한"
                isSelected={selectedButton === '간단한'}
                onToggle={() => toggleButton('간단한')}
              />
              <StyleButton
                className={`h-[9rem] w-[21rem] ${selectedButton === '다이나믹한' ? 'selected' : ''}`}
                buttonText="다이나믹한"
                isSelected={selectedButton === '다이나믹한'}
                onToggle={() => toggleButton('다이나믹한')}
              />
              <StyleButton
                className={`h-[9rem] w-[21rem] ${selectedButton === '공식적인' ? 'selected' : ''}`}
                buttonText="공식적인"
                isSelected={selectedButton === '공식적인'}
                onToggle={() => toggleButton('공식적인')}
              />
              <StyleButton
                className={`h-[9rem] w-[21rem] ${selectedButton === '고급진' ? 'selected' : ''}`}
                buttonText="고급진"
                isSelected={selectedButton === '고급진'}
                onToggle={() => toggleButton('고급진')}
              />
            </div>
            <div className="mx-auto flex w-3/4 flex-row justify-between space-x-12">
              <StyleButton
                className={`h-[9rem] w-[21rem] ${selectedButton === '창의적인' ? 'selected' : ''}`}
                buttonText="창의적인"
                isSelected={selectedButton === '창의적인'}
                onToggle={() => toggleButton('창의적인')}
              />
              <StyleButton
                className={`h-[9rem] w-[21rem] ${selectedButton === '힙한' ? 'selected' : ''}`}
                buttonText="힙한"
                isSelected={selectedButton === '힙한'}
                onToggle={() => toggleButton('힙한')}
              />
              <StyleButton
                className={`h-[9rem] w-[21rem] ${selectedButton === '귀여운' ? 'selected' : ''}`}
                buttonText="귀여운"
                isSelected={selectedButton === '귀여운'}
                onToggle={() => toggleButton('귀여운')}
              />
            </div>
            <div className="mt-56 flex w-full flex-row justify-between px-4">
              <Link to="/choosecolor">
                <MoveButton buttonText="이전" />
              </Link>
              <Link to="/logomusic">
                <MoveButton buttonText="생성" />
              </Link>
            </div>
          </div>
        </Background>
      </div>
    </div>
  );
}

export default SelectStylePage;
