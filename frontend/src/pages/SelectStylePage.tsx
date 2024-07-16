import React from 'react';
import Background from '../components/Background.tsx';
import NavBar from '../components/NavBar.tsx';
import StyleButton from '../components/StyleButton.tsx';
import MoveButton from '../components/MoveButton.tsx';
import { Link } from 'react-router-dom';

// 스타일 선택 페이지
function SelectStylePage() {
  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-[#000000] bg-cover">
      <div className="relative h-full w-full">
        <Background>
          <NavBar />
          <div className="w-auto flex-col items-center justify-center space-y-8">
            <div className="mx-auto flex w-3/4 flex-row justify-between space-x-12">
              <StyleButton className="h-[9rem] w-[21rem]" buttonText="모던한" />
              <StyleButton
                className="h-[9rem] w-[21rem]"
                buttonText="장난스러운"
              />
              <StyleButton className="h-[9rem] w-[21rem]" buttonText="재미난" />
            </div>
            <div className="mx-auto flex w-auto flex-row justify-between space-x-4">
              <StyleButton className="h-[9rem] w-[21rem]" buttonText="간단한" />
              <StyleButton
                className="h-[9rem] w-[21rem]"
                buttonText="다이나믹한"
              />
              <StyleButton
                className="h-[9rem] w-[21rem]"
                buttonText="공식적인"
              />
              <StyleButton className="h-[9rem] w-[21rem]" buttonText="고급진" />
            </div>
            <div className="mx-auto flex w-3/4 flex-row justify-between space-x-12">
              <StyleButton
                className="h-[9rem] w-[21rem]"
                buttonText="창의적인"
              />
              <StyleButton className="h-[9rem] w-[21rem]" buttonText="힙한" />
              <StyleButton className="h-[9rem] w-[21rem]" buttonText="귀여운" />
            </div>
            <div className="flex flex-row justify-between">
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
