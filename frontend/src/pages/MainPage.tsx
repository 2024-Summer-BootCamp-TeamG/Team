import React, { ReactNode } from 'react';

import FullNote1 from '../assets/MusicNote/FullNote1.svg';
import FullNote2 from '../assets/MusicNote/FullNote2.svg';
import FullNote3 from '../assets/MusicNote/FullNote3.svg';
import FullNote4 from '../assets/MusicNote/FullNote4.svg';
import FullNote5 from '../assets/MusicNote/FullNote5.svg';
import FullNote6 from '../assets/MusicNote/FullNote6.svg';
import FullNote7 from '../assets/MusicNote/FullNote7.svg';
interface MainPageProps {
  children: ReactNode;
}

interface Coordinate {
  src: string;
  left?: string;
  right?: string;
  top: string;
}
export default function MainPage({ children }: MainPageProps) {
  const notes: Coordinate[] = [
    { src: FullNote1, right: '90%', top: '70%' },
    { src: FullNote2, left: '10%', top: '80%' },
    { src: FullNote3, left: '90%', top: '70%' },
    { src: FullNote4, left: '25%', top: '90%' },
    { src: FullNote5, left: '80%', top: '15%' },
    { src: FullNote6, left: '10%', top: '30%' },
    { src: FullNote7, left: '2%', top: '40%' },
  ];

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-black bg-cover">
      <div className="relative h-full w-full">
        {notes.map((note, index) => (
          <img
            key={index}
            src={note.src}
            alt="음표"
            className="absolute"
            style={{
              position: 'absolute',
              left: note.left,
              top: note.top,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
        {children}
        <div className="absolute left-1/2 items-center justify-center">
          <div className="relative text-8xl text-teal-200">
            HOW ARE YOU <br />
            FEELING TODAY?
          </div>
          <div className="relative mt-4 text-5xl text-teal-200">
            오늘 당신의 기분과 음악을 알려드릴게요!
          </div>
        </div>
        <div className="top-2/5 relative left-1/3 flex items-center justify-center text-center">
          <div className="mr-9 flex h-[3rem] w-[14rem] items-center justify-center rounded-3xl border border-white bg-gray-800 text-xl text-white">
            로그인
          </div>
          <div className="ml-9 flex h-[3rem] w-[14rem] items-center justify-center rounded-3xl border border-white bg-slate-300 text-xl text-black">
            회원가입
          </div>
        </div>
        <img className="absolute left-[15rem] top-[20rem] h-[20rem] w-[30rem] origin-top-left rotate-[24.20deg] rounded-full bg-gradient-to-br from-slate-50 to-violet-600 shadow" />
        <img className="absolute left-[23rem] top-[20rem] h-[13rem] w-[20rem] origin-top-left rotate-[-22deg] rounded-full bg-gradient-to-tl from-neutral-50 to-teal-300 shadow" />
      </div>
    </div>
  );
}
