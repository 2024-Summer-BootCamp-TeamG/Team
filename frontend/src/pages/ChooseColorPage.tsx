import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import StyleButton from '../components/StyleButton';
import { Link } from 'react-router-dom';
import MoveButton from '../components/MoveButton.tsx';
import { useRecoilState } from 'recoil';
import { ChooseColorState } from '../recoil/ChooseColorAtom.ts';

function ChooseColorPage() {
  const [activeColor, setActiveColor] = useState(null);

  const colors = [
    {
      name: 'RED',
      color: 'bg-red-500/80',
      hover: 'hover:bg-white/80 hover:text-black',
    },
    {
      name: 'ORANGE',
      color: 'bg-orange-400/80',
      hover: 'hover:bg-white/80 hover:text-black',
    },
    {
      name: 'YELLOW',
      color: 'bg-yellow-300/80',
      hover: 'hover:bg-white/80 hover:text-black',
    },
    {
      name: 'GRAY',
      color: 'bg-gray-400/80',
      hover: 'hover:bg-white/80 hover:text-black',
    },
    {
      name: 'GREEN',
      color: 'bg-green-500/80',
      hover: 'hover:bg-white/70 hover:text-black',
    },
    {
      name: 'BLUE',
      color: 'bg-blue-600/80',
      hover: 'hover:bg-white/70 hover:text-black',
    },
    {
      name: 'PINK',
      color: 'bg-pink-400/80',
      hover: 'hover:bg-white/70 hover:text-black',
    },
    {
      name: 'AQUA',
      color: 'bg-cyan-200/80',
      hover: 'hover:bg-white/70 hover:text-black',
    },
    {
      name: 'PURPLE',
      color: 'bg-purple-400/80',
      hover: 'hover:bg-white/70 hover:text-black',
    },
    {
      name: 'WHITE',
      color: 'bg-white/80',
      border: 'border border-white',
      hover: 'hover:bg-black/70 hover:text-white',
    },
    {
      name: 'BLACK',
      color: 'bg-black/80',
      border: 'border border-white',
      hover: 'hover:bg-white/70 hover:text-black',
    },
    {
      name: 'RANDOM',
      color:
        'bg-gradient-to-tl from-fuchsia-500/80 via-teal-400/80 to-yellow-300/80',
      hover: 'hover:bg-white/70 hover:text-black',
    },
  ];

  const handleButtonClick = (color: any) => {
    setActiveColor(color);
  };

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-black bg-cover">
      <div className="relative h-full w-full">
        <NavBar />
        <div className="mt-56 flex items-center justify-center text-center text-4xl text-white">
          원하는 색상을 선택해주세요!
        </div>

        <div className="relative top-14 flex flex-col items-center justify-center text-center">
          <div className="grid grid-cols-4 gap-9">
            {colors.map(({ name, color, hover, border }) => (
              <button
                key={name}
                className={`relative flex h-[9rem] w-[20rem] items-center justify-center rounded-xl text-[2rem] text-white transition-colors duration-300 ${color} ${border} ${
                  activeColor === name ? 'bg-white/80 text-black' : hover
                }`}
                onClick={() => handleButtonClick(name)}
              >
                {name}
              </button>
            ))}
          </div>
          <div className="mt-28 flex w-full justify-between">
            <Link to="/textinput">
              <div className="ml-[10rem]">
                <MoveButton className="ml-[5rem]" buttonText="이전" />
              </div>
            </Link>

            <Link to="/selectstyle">
              <div className="mr-[10rem]">
                <MoveButton className="ml-[5rem]" buttonText="다음" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChooseColorPage;
