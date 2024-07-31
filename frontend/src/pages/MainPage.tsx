import React, { useState, useEffect, ReactNode } from 'react';
import './MainPage.scss';
import { useSpring, animated } from 'react-spring';
import Background3 from '../components/Background3';
import { Link } from 'react-router-dom';
import SignupFrame from '../assets/Main.jpeg';
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
              <div className="mt-[5rem]">
                프로모션 제품을 위한 맞춤형 음악, 로고, 포스터를 제공합니다.
                <br />
                Brandify로 자신만의 상품을 브랜딩해보세요!
              </div>
              <div
                className="mt-8 flex w-full justify-center space-x-8"
                style={{ marginTop: '3rem' }}
              >
                <Link to="/signup" style={{ marginBottom: '1rem' }}>
                  <button className="font-['Cafe24 Danjunghae'] hover:border-blue h-[3rem] w-[15rem] items-center justify-center rounded-[2.5rem] border-2 border-white bg-white/30 text-center text-2xl font-normal text-white hover:bg-black hover:text-white">
                    회원가입
                  </button>
                </Link>
                <Link to="/signin">
                  <button className="font-['Cafe24 Danjunghae'] hover:border-blue h-[3rem] w-[15rem] items-center justify-center rounded-[2.5rem] border-2 border-white bg-white/30 text-center text-2xl font-normal text-white hover:bg-black hover:text-white">
                    로그인
                  </button>
                </Link>
              </div>

              <div
                className="w-full justify-between text-center text-5xl text-white"
                style={{ marginTop: '15rem' }}
              >
                저희 사이트의 사용방법을 알려드릴게요
              </div>

              <div
                className="w-full justify-between text-center text-4xl text-white"
                style={{ marginTop: '5rem' }}
              >
                step1
              </div>
              <div
                className="flex w-full items-center justify-between text-center text-4xl text-white"
                style={{ marginTop: '3rem', opacity: opacity }}
              >
                <p className="text-[1rem] text-[#66CCFF]">
                  프로모션 하고 싶으신 제품 사진을 찍고 사진을 업로드 한 뒤
                  "브랜딩 start" 버튼을 눌러주세요
                </p>
                <img
                  className="w-[50rem]"
                  src={SignupFrame}
                  alt="회원가입 사진"
                />
              </div>
              <div
                className="w-full justify-between text-center text-4xl text-white"
                style={{ marginTop: '3rem' }}
              >
                step2
              </div>
              <div
                className="w-full justify-between text-center text-4xl text-white"
                style={{ marginTop: '3rem', opacity: opacity }}
              >
                로고와 포스터에 들어갈 택스트와 색상,스타일을 선택하고 생성
                버튼을 눌러 주세요!
              </div>
              <div
                className="w-full justify-between text-center text-4xl text-white"
                style={{ marginTop: '3rem' }}
              >
                step3
              </div>
              <div
                className="w-full justify-between text-center text-4xl text-white"
                style={{ marginTop: '3rem', opacity: opacity }}
              >
                생성이 완료되었다면 목록에서 이미지를 클릭하세요 생성하신
                결과물을 다시 보실 수 있답니다.
              </div>

              <div
                className="w-full justify-between text-center text-3xl text-white hover:text-blue-500"
                style={{ marginTop: '5rem' }}
              >
                <a
                  href="https://file.notion.so/f/f/f4c1918f-224c-424d-ae68-fe3cf854f100/b901661b-be63-4092-9298-352465e58421/%E1%84%8C%E1%85%A6%E1%84%86%E1%85%A9%E1%86%A8_%E1%84%8B%E1%85%A5%E1%86%B9%E1%84%8B%E1%85%B3%E1%86%B7_(2)_(1).mp4?id=640d7281-a3b1-46c0-bbe3-60bfc78e2625&table=block&spaceId=f4c1918f-224c-424d-ae68-fe3cf854f100&expirationTimestamp=1722340800000&signature=46SVcYb26feb9nCWRoRvslREcqk8-B0CNaqVZl6nPq4&downloadName=%E1%84%8C%E1%85%A6%E1%84%86%E1%85%A9%E1%86%A8+%E1%84%8B%E1%85%A5%E1%86%B9%E1%84%8B%E1%85%B3%E1%86%B7+%282%29+%281%29.mp4"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  더 자세한 내용을 원하신다면 클릭해 주세요
                </a>
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
