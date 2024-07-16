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
    <div className="relative flex w-screen h-screen flex-col items-center justify-center bg-black bg-cover">
      <div className="relative w-full h-full">
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

        <div className="absolute items-center justify-center left-1/2 top-1/4">
          <div className="relative text-teal-200 text-8xl">HOW ARE YOU <br />FEELING TODAY?</div>
          <div className="relative text-5xl text-teal-200 mt-4">오늘 당신의 기분과 음악을 알려드릴게요!</div>
      
        </div>
      
        <div className="relative text-center flex items-center justify-center left-1/3 top-[38rem] left-80">
          <div className="flex items-center justify-center w-[14rem] h-[3rem] text-xl bg-gray-800 border border-white border text-white rounded-3xl mr-9">로그인</div>
          <div className="flex items-center justify-center w-[14rem] h-[3rem] text-xl bg-slate-300 text-black items-center border border-white rounded-3xl ml-9">회원가입</div>
        </div>

        <img className="absolute w-[30rem] h-[20rem] bg-gradient-to-br from-slate-50 to-violet-600 left-[15rem] top-[20rem] origin-top-left rotate-[24.20deg] rounded-full shadow" />
        <img className="w-[20rem] h-[13rem] bg-gradient-to-tl from-neutral-50 to-teal-300 left-[23rem] top-[20rem] absolute origin-top-left rotate-[-22deg] rounded-full shadow"  />
    
      </div>
    </div >
  );
}
