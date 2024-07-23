import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import MoveButton from '../components/MoveButton';
import '../pages/mouse/style.css';
import { Link, useNavigate } from 'react-router-dom';

import { useRecoilState } from 'recoil';
import { ChooseColorState } from '../recoil/ChooseColorAtom';
interface Color {
  name: string;
  color: string;
  hoverClass: string;
  // hoverColor: string;
}

function ChooseColorPage() {
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [selectedButton, setSelectedButton] = useRecoilState(ChooseColorState);
  // const [isButtonClicked, setIsButtonClicked] = useState(false);

  const navigate = useNavigate();

  const colors: Color[] = [
    {
      name: 'RED',
      color: '#ff0000',
      // hoverColor: '#ff0000',

      hoverClass: 'raise',
    },
    {
      name: 'ORANGE',
      color: '#ff7f00',
      // hoverColor: '#ff7f00',

      hoverClass: 'raise',
    },
    {
      name: 'YELLOW',
      color: '#ffff00',
      // hoverColor: '#ffff00',

      hoverClass: 'raise',
    },
    {
      name: 'GRAY',
      color: '#808080',
      // hoverColor: '#808080',

      hoverClass: 'raise',
    },
    {
      name: 'GREEN',
      color: '#00ff00',
      // hoverColor: '#ffb366',

      hoverClass: 'raise',
    },
    {
      name: 'BLUE',
      color: '#0000ff',
      // hoverColor: '#0000ff',

      hoverClass: 'raise',
    },
    {
      name: 'PINK',
      color: '#ff1493',
      // hoverColor: '#ffb366',

      hoverClass: 'raise',
    },
    {
      name: 'AQUA',
      color: '#00ffff',
      // hoverColor: '#ffb366',

      hoverClass: 'raise',
    },
    {
      name: 'PURPLE',
      color: '#800080',
      // hoverColor: '#ffb366',

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
      // hoverColor: '#ffb366',

      hoverClass: 'raise',
    },
    {
      name: 'RANDOM',
      color:
        'bg-gradient-to-tl from-fuchsia-500/80 via-teal-400/80 to-yellow-300/80',
      // hoverColor: '#ffb366',

      hoverClass: 'raise',
    },
  ];

  const handleButtonClick = (color: string) => {
    setActiveColor(color);
    setSelectedButton(color);
  };
  const handleSubmit = (event: any) => {
    event.preventDefault();
    console.log('Selected color:', selectedButton);

    navigate('/selectstyle'); // 폼 제출 후 다음 페이지로 이동
  };
  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-black bg-cover">
      <div className="relative h-full w-full">
        <NavBar />
        <div className="mb-12 mt-32 flex items-center justify-center text-center text-xl text-white">
          원하는 색상을 선택해주세요!
        </div>

        <div className="relative flex flex-col items-center justify-center text-center">
          <div className="grid grid-cols-4 gap-3">
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
                  className={`relative flex h-[6rem] w-[12rem] items-center justify-center rounded-xl text-[1rem] text-white transition-colors duration-300 ${hoverClass}`}
                  style={buttonStyle}
                  onClick={() => handleButtonClick(name)}
                >
                  {name}
                </button>
              );
            })}
          </div>
          <form className="mt-20 flex w-full justify-around">
            <Link to="/textinput">
              <div className="ml-[5rem]">
                <MoveButton className="ml-[5rem]" buttonText="이전" />
              </div>
            </Link>

            <Link to="/selectstyle">
              <div className="mr-[5rem]">
                <MoveButton
                  className="ml-[5rem]"
                  buttonText="다음"
                  onClick={handleSubmit}
                />
              </div>
            </Link>

          </form>
        </div>
      </div>
    </div>
  );
}

export default ChooseColorPage;
