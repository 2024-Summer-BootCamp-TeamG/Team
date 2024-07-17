import React, { useState } from 'react';
import Background from '../components/Background.tsx';
import NavBar from '../components/NavBar.tsx';
import StyleButton from '../components/StyleButton.tsx';
import MoveButton from '../components/MoveButton.tsx';
import { Link } from 'react-router-dom';

// 스타일 선택 페이지
function SelectStylePage() {
  const [selectedButton, setSelectedButton] = useState(''); // 선택된 버튼 상태

  // 버튼 클릭 핸들러
  const handleButtonClick = (buttonText: React.SetStateAction<string>) => {
    setSelectedButton(buttonText); // 선택된 버튼으로 상태 업데이트
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
                onClick={() => handleButtonClick('모던한')}
              />
              <StyleButton
                className={`h-[9rem] w-[21rem] ${selectedButton === '장난스러운' ? 'selected' : ''}`}
                buttonText="장난스러운"
                onClick={() => handleButtonClick('장난스러운')}
              />
              <StyleButton
                className={`h-[9rem] w-[21rem] ${selectedButton === '재미난' ? 'selected' : ''}`}
                buttonText="재미난"
                onClick={() => handleButtonClick('재미난')}
              />
            </div>
            <div className="mx-auto flex w-auto flex-row justify-between space-x-4">
              <StyleButton
                className={`h-[9rem] w-[21rem] ${selectedButton === '간단한' ? 'selected' : ''}`}
                buttonText="간단한"
                onClick={() => handleButtonClick('간단한')}
              />
              <StyleButton
                className={`h-[9rem] w-[21rem] ${selectedButton === '다이나믹한' ? 'selected' : ''}`}
                buttonText="다이나믹한"
                onClick={() => handleButtonClick('다이나믹한')}
              />
              <StyleButton
                className={`h-[9rem] w-[21rem] ${selectedButton === '공식적인' ? 'selected' : ''}`}
                buttonText="공식적인"
                onClick={() => handleButtonClick('공식적인')}
              />
              <StyleButton
                className={`h-[9rem] w-[21rem] ${selectedButton === '고급진' ? 'selected' : ''}`}
                buttonText="고급진"
                onClick={() => handleButtonClick('고급진')}
              />
            </div>
            <div className="mx-auto flex w-3/4 flex-row justify-between space-x-12">
              <StyleButton
                className={`h-[9rem] w-[21rem] ${selectedButton === '창의적인' ? 'selected' : ''}`}
                buttonText="창의적인"
                onClick={() => handleButtonClick('창의적인')}
              />
              <StyleButton
                className={`h-[9rem] w-[21rem] ${selectedButton === '힙한' ? 'selected' : ''}`}
                buttonText="힙한"
                onClick={() => handleButtonClick('힙한')}
              />
              <StyleButton
                className={`h-[9rem] w-[21rem] ${selectedButton === '귀여운' ? 'selected' : ''}`}
                buttonText="귀여운"
                onClick={() => handleButtonClick('귀여운')}
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
