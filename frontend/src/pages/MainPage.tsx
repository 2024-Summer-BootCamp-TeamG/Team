import React, { useState, useEffect, ReactNode } from 'react';
import './MainPage.scss';
import { useSpring, animated } from 'react-spring';
import Background3 from '../components/Background3';

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

  const opacity = Math.max(0, Math.min(1, (offsetY - 300) / 500));

  return (
    <div className="MainPage">
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-cover">
        <Background3>
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
                Brandify <br />
              </div>
              <div className="opacity mt-16 text-base">
                <p>
                  프로모션 제품을 위한 맞춤형 음악, 로고, 포스터를 제공합니다.
                </p>
                <p>
                  <span className="Brandi"> Brandify </span>로 자신만의 상품을
                  로 자신만의 상품을 브랜딩해보세요!
                </p>
              </div>
              <div className="mt-8 flex w-full flex-col items-center justify-center space-y-4">
                <Link to="/signup" style={{ marginBottom: '1rem' }}>
                  <button className="font-['Cafe24 Danjunghae'] hover:border-blue flex h-[3rem] w-[20rem] flex-col items-center justify-center rounded-[2.5rem] border-2 border-white bg-white/20 text-center text-xl font-normal text-white hover:bg-white/80 hover:text-black">
                    회원가입
                  </button>
                </Link>
                <Link to="/signin">
                  <button className="font-['Cafe24 Danjunghae'] hover:border-blue flex h-[3rem] w-[20rem] flex-col items-center justify-center rounded-[2.5rem] border-2 border-white bg-white/20 text-center text-xl font-normal text-white hover:bg-white/80 hover:text-black">
                    로그인
                  </button>
                </Link>
              </div>

              {children}
            </div>
          </div>
        </Background3>
      </div>
    </div>
  );
}

export default MainPage;
