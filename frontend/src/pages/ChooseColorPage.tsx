import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import { Link } from 'react-router-dom';
import MoveButton from '../components/MoveButton';
import '../pages/mouse/style.css';

interface Color {
  name: string;
  color: string;
  hoverClass: string;
}

function ChooseColorPage() {
  const [activeColor, setActiveColor] = useState<string | null>(null);

  const colors: Color[] = [
    {
      name: 'RED',
      color: '#ff0000',
      hoverClass: 'raise',
    },
    {
      name: 'ORANGE',
      color: '#ff7f00',
      hoverClass: 'raise',
    },
    {
      name: 'YELLOW',
      color: '#ffff00',
      hoverClass: 'raise',
    },
    {
      name: 'GRAY',
      color: '#808080',
      hoverClass: 'raise',
    },
    {
      name: 'GREEN',
      color: '#00ff00',
      hoverClass: 'raise',
    },
    {
      name: 'BLUE',
      color: '#0000ff',
      hoverClass: 'raise',
    },
    {
      name: 'PINK',
      color: '#ff1493',
      hoverClass: 'raise',
    },
    {
      name: 'AQUA',
      color: '#00ffff',
      hoverClass: 'raise',
    },
    {
      name: 'PURPLE',
      color: '#800080',
      hoverClass: 'raise',
    },
    {
      name: 'WHITE',
      color: '#ffffff',
      hoverClass: 'raise',
    },
    {
      name: 'BLACK',
      color: '#000000',
      hoverClass: 'raise',
    },
    {
      name: 'RANDOM',
      color:
        'linear-gradient(to right, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)',
      hoverClass: 'raise',
    },
  ];

  const handleButtonClick = (color: string) => {
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
            {colors.map(({ name, color, hoverClass }) => {
              const buttonStyle: React.CSSProperties = {
                '--c': color,
                backgroundColor: color,
                ...(activeColor === name && {
                  backgroundColor: 'white',
                  color: 'black',
                }),
              } as React.CSSProperties;

              return (
                <button
                  key={name}
                  className={`relative flex h-[9rem] w-[20rem] items-center justify-center rounded-xl text-[2rem] text-white transition-colors duration-300 ${hoverClass}`}
                  style={buttonStyle}
                  onClick={() => handleButtonClick(name)}
                >
                  {name}
                </button>
              );
            })}
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
