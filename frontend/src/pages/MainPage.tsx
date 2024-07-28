import React, { useState, useEffect, ReactNode } from 'react';
import './MainPage.scss';

import Background from '../components/Background';
import { Link } from 'react-router-dom';

interface MainPageProps {
  children: ReactNode;
}

function MainPage({ children }: MainPageProps) {
  const [offsetY, setOffsetY] = useState(0);
  const handleScroll = () => setOffsetY(window.pageYOffset);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="MainPage">
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-cover">
        <Background>
          <div
            className="MainPage__background"
            style={{ transform: `translateY(-${offsetY * 0.5}px)` }}
          />
          <div className="MainPage__content flex">
            <div className="MainPage__video">
              <video
                src="https://cdn-front-door.elice.io/landing/static/video/elice_landing_0120.mp4"
                autoPlay
                loop
                muted
                className="MainPage__video__element"
              />
            </div>
            <div className="MainPage__content__text">
              <div className="MainPage__title">
                HOW ARE YOU <br /> FEELING TODAY?
              </div>
              <div>오늘 당신의 기분과 음악을 알려드릴게요!</div>
              <div className="mt-8 flex w-full justify-between px-4">
                <Link to="/signin">
                  <button className="font-['Cafe24 Danjunghae'] hover:border-blue h-[3rem] w-[15rem] items-center justify-center rounded-[2.5rem] border-2 border-white bg-white/30 text-center text-2xl font-normal text-white hover:bg-black hover:text-white">
                    로그인
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="font-['Cafe24 Danjunghae'] hover:border-blue h-[3rem] w-[15rem] items-center justify-center rounded-[2.5rem] border-2 border-white bg-white/30 text-center text-2xl font-normal text-white hover:bg-black hover:text-white">
                    회원가입
                  </button>
                </Link>
              </div>
              {children}
            </div>
          </div>
        </Background>
      </div>
    </div>
  );
}

export default MainPage;
