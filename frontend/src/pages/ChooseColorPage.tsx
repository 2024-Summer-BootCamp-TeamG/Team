import React from 'react';
import NavBar from '../components/NavBar';
import StyleButton from '../components/StyleButton';
import { Link } from 'react-router-dom';
import MoveButton from '../components/MoveButton.tsx';

function ChooseColorPage() {
  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-black bg-cover">
      <div className="relative h-full w-full">
        <NavBar />
        <div className="mt-56 flex items-center justify-center text-center text-4xl text-white">
          원하는 색상을 선택해주세요!
        </div>

        <div className="relative top-14 flex flex-col items-center justify-center text-center">
          <div className="grid grid-cols-4 gap-9">
            <div className="relative flex h-[9rem] w-[20rem] items-center justify-center rounded-xl bg-red-500/80 text-[2rem] text-white transition-colors duration-300 hover:bg-white/80 hover:text-black">
              RED
            </div>
            <div className="relative flex h-[9rem] w-[20rem] items-center justify-center rounded-xl bg-orange-400/80 text-[2rem] text-white transition-colors duration-300 hover:bg-white/80 hover:text-black">
              ORANGE
            </div>
            <div className="relative flex h-[9rem] w-[20rem] items-center justify-center rounded-xl bg-yellow-300/80 text-[2rem] text-white transition-colors duration-300 hover:bg-white/80 hover:text-black">
              YELLOW
            </div>
            <div className="relative flex h-[9rem] w-[20rem] items-center justify-center rounded-xl bg-gray-400/80 text-[2rem] text-white transition-colors duration-300 hover:bg-white/80 hover:text-black">
              GRAY
            </div>
            <div className="relative flex h-[9rem] w-[20rem] items-center justify-center rounded-xl bg-green-500/80 text-[2rem] text-white transition-colors duration-300 hover:bg-white/70 hover:text-black">
              GREEN
            </div>
            <div className="relative flex h-[9rem] w-[20rem] items-center justify-center rounded-xl bg-blue-600/80 text-[2rem] text-white transition-colors duration-300 hover:bg-white/70 hover:text-black">
              BLUE
            </div>
            <div className="relative flex h-[9rem] w-[20rem] items-center justify-center rounded-xl bg-pink-400/80 text-[2rem] text-white transition-colors duration-300 hover:bg-white/70 hover:text-black">
              PINK
            </div>
            <div className="relative flex h-[9rem] w-[20rem] items-center justify-center rounded-xl bg-cyan-200/80 text-[2rem] text-white transition-colors duration-300 hover:bg-white/70 hover:text-black">
              AQUA
            </div>
            <div className="relative flex h-[9rem] w-[20rem] items-center justify-center rounded-xl bg-purple-400/80 text-[2rem] text-white transition-colors duration-300 hover:bg-white/70 hover:text-black">
              PURPLE
            </div>
            <div className="relative flex h-[9rem] w-[20rem] items-center justify-center rounded-xl border border-white bg-white/80 text-[2rem] text-black transition-colors duration-300 hover:bg-black/70 hover:text-white">
              WHITE
            </div>
            <div className="relative flex h-[9rem] w-[20rem] items-center justify-center rounded-xl border border-white bg-black/80 text-[2rem] text-white transition-colors duration-300 hover:bg-white/70 hover:text-black">
              BLACK
            </div>
            <div className="relative flex h-[9rem] w-[20rem] items-center justify-center rounded-xl bg-gradient-to-tl from-fuchsia-500/80 via-teal-400/80 to-yellow-300/80 text-[2rem] text-white transition-colors duration-300 hover:bg-white/70 hover:text-black">
              RANDOM
            </div>
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
