import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import MoveButton from '../components/MoveButton';
import '../pages/mouse/style.css';
import { Link, useNavigate } from 'react-router-dom';
import leftArrow from '../assets/leftArrow.svg';
import rightArrow from '../assets/rightArrow.svg';
import { useRecoilState } from 'recoil';
import { ChooseColorState } from '../recoil/ChooseColorAtom';
interface Color {
  name: string;
  color: string;
  hoverClass: string;
  nextColor: string;
}
function ChooseColorPage() {
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [selectedButton, setSelectedButton] = useRecoilState(ChooseColorState);
  // const [isButtonClicked, setIsButtonClicked] = useState(false);
  const navigate = useNavigate();
  const colors: Color[] = [
    {
      name: 'RED',
      color: '#FF0000',
      // hoverColor: '#FF0000',
      nextColor: '#B45F5F',
      hoverClass: 'raise',
    },
    {
      name: 'ORANGE',
      color: '#FF7F00',
      // hoverColor: '#FF7F00',
      nextColor: '#CDA277',
      hoverClass: 'raise',
    },
    {
      name: 'YELLOW',
      color: '#FFFF00',
      // hoverColor: '#FFFF00',
      nextColor: '#D8D8AB',
      hoverClass: 'raise',
    },
    {
      name: 'GRAY',
      color: '#808080',
      // hoverColor: '#808080',
      nextColor: '#D8D2D2',
      hoverClass: 'raise',
    },
    {
      name: 'GREEN',
      color: '#00FF00',
      nextColor: '#B7D6B1',
      // hoverColor: '#FFB366',
      hoverClass: 'raise',
    },
    {
      name: 'BLUE',
      color: '#0000FF',
      nextColor: '#8383D7',
      // hoverColor: '#0000FF',
      hoverClass: 'raise',
    },
    {
      name: 'PINK',
      color: '#FF1493',
      nextColor: '#E58CDA',
      // hoverColor: '#FFB366',
      hoverClass: 'raise',
    },
    {
      name: 'AQUA',
      color: '#00FFFF',
      nextColor: '#C7E4E4',
      // hoverColor: '#FFB366',
      hoverClass: 'raise',
    },
    {
      name: 'PURPLE',
      color: '#800080',
      nextColor: '#D2C0D2',
      // hoverColor: '#FFB366',
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
      // hoverColor: '#FFB366',
      hoverClass: 'raise',
    },
    {
      name: 'RANDOM',
      nextColor:
        'linear-gradient(100deg, #B20000 7.13%, #CCB300 21.06%, #0B6 43.01%, #0CCC 59.9%, #0033B2 74.68%, #B200B2 91.57%)',
      color:
        ' linear-gradient(100deg, #F00 7.13%, #FFE500 21.06%, #0F6 43.01%, #0FF 59.9%, #0038FF 74.68%, #FA00FF 91.57%)',
      // hoverColor: '#FFB366',
      hoverClass: 'raise',
    },
  ];
  const handleButtonClick = (color: string, nextColor: string) => {
    setActiveColor(color);
    setSelectedButton(nextColor);
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
        <div className="mb-12 mt-32 flex items-center justify-center text-center text-3xl text-white">
          원하는 색상을 선택해주세요!
        </div>
        <div className="relative flex flex-col items-center justify-center text-center">
          <div className="grid grid-cols-4 gap-3">
            {colors.map(({ name, color, hoverClass, nextColor }) => {
              const isWhite = name === 'WHITE' || name === 'YELLOW';
              const isRandom = name === 'RANDOM';
              const buttonStyle: React.CSSProperties = {
                '--c': color,
                background: isRandom ? color : color, // RANDOM 색상은 background로 설정
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
                  className={`relative flex h-[7rem] w-[14rem] items-center justify-center rounded-xl text-[1rem] text-white transition-colors duration-300 ${hoverClass}`}
                  style={buttonStyle}
                  onClick={() => handleButtonClick(name, nextColor)}
                >
                  {name}
                </button>
              );
            })}
          </div>
          <div className="mt-2 mt-8 flex w-full justify-between px-4">
            <Link to="/texi">
              <button
                type="button"
                className="font-['Cafe24 Danjunghae'] hover:text-bermuda flex h-[5rem] w-[12.5rem] justify-center text-center text-3xl font-normal text-white"
              >
                <img
                  className="h-[2.5rem] w-[2.5rem]"
                  src={leftArrow}
                  alt="이전"
                />
                <p>이전</p>
              </button>
            </Link>
            <Link to="/selectstyle">
              <button className="hover:text-bermuda font-['Cafe24 Danjunghae'] flex h-[5rem] w-[12.5rem] justify-center text-center text-3xl font-normal text-white">
                다음
                <img
                  className="h-[2.5rem] w-[2.5rem]"
                  src={rightArrow}
                  alt="다음"
                />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ChooseColorPage;
