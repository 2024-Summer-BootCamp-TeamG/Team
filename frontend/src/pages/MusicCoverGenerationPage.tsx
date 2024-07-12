import React, { useState } from 'react';

import Background from '../components/Background';
import NavBar from '../components/NavBar';
import AlbumCover from '../assets/Album.png';
import MusicBar from '../assets/Bar.svg';
import PlayButton from '../assets/PlayButton.svg';
import FlippedPic from '../assets/Picture.png';
export default function MusicCoverGenerationPage() {
  const [isFlipped, setIsFlipped] = useState(false); // 초기 상태는 플립되지 않은 상태

  const handleClick = () => {
    setIsFlipped(!isFlipped); // 클릭 시 상태를 토글하여 플립 효과를 구현
  };
  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-[#000000] bg-cover">
      <Background>
        <NavBar />
        <div className="ml-[190px] mr-[190px] flex min-h-screen flex-row items-center justify-around">
          <div
            className="flip-container relative z-10 flex h-[700px] w-[600px] justify-center rounded-[40px] border-2 border-white bg-gradient-to-b from-white to-black opacity-50 shadow backdrop-blur-[55px]"
            onClick={handleClick}
          >
            <div className="flex flex-col items-center justify-center">
              <img
                src={isFlipped ? FlippedPic : AlbumCover}
                alt="앨범 커버"
                className="mx-[3rem] mb-[3rem] flex h-[452px] w-[432px] items-center"
              ></img>
              <img src={MusicBar} alt="음악 재생 바" className="mb-2"></img>
              <div className="flex flex-row items-center text-white">
                <p>0:00</p>
                <button type="button">
                  <img
                    src={PlayButton}
                    alt="음악 재생 버튼"
                    className="mx-40"
                  ></img>
                </button>
                <p>2:20</p>
              </div>
            </div>
          </div>
          <div className="bg-white/opacity-20 relative flex h-[791px] w-[756px] flex-col rounded-[40px] border-2 border-white px-8 opacity-50 shadow backdrop-blur-[55px]">
            <div className="mt-4 break-words text-4xl font-medium text-gradient-custom md:text-xl lg:text-4xl">
              오늘 당신의 상태는?
            </div>
            <div className="text-[3.5rem] font-medium text-white">
              안녕하세요
            </div>
            <div className="flex flex-row overflow-y-auto">
              <div className="scrollbar-style mb-4 overflow-y-auto text-[1.5rem] font-semibold text-white">
                미술 심리치료(Art Therapy)는 개인의 감정, 생각, 경험 등을 예술
                창작 활동을 통해 표현하고, 이를 통해 내면을 탐구하며 심리적 치료
                효과를 얻는 방법입니다. 미술 심리치료에서 그림을 해석하는 것은
                매우 중요한 과정 중 하나입니다. 그림에 나타난 색상, 구성, 상징
                등을 통해 내담자의 심리 상태를 파악할 수 있습니다. <br />
                <br />
                전문가적 해석 1. 집과 별 모양: 집: 집은 종종 안전, 안정, 가족,
                그리고 자신을 표현하는 상징으로 사용됩니다. 그림 속의 집은
                전면에 위치하고 있으며 문이 중앙에 있어 안정적이고 안전한 느낌을
                줍니다. 별 모양: 별은 희망, 소망, 꿈을 상징합니다. 집 위에 있는
                별은 이 집이 희망과 꿈을 담고 있다는 것을 나타낼 수 있습니다.
                <br />
                전문가적 해석 1. 집과 별 모양: 집: 집은 종종 안전, 안정, 가족,
                그리고 자신을 표현하는 상징으로 사용됩니다. 그림 속의 집은
                전면에 위치하고 있으며 문이 중앙에 있어 안정적이고 안전한 느낌을
                줍니다. 별 모양: 별은 희망, 소망, 꿈을 상징합니다. 집 위에 있는
                별은 이 집이 희망과 꿈을 담고 있다는 것을 나타낼 수 있습니다.
                <br />
                전문가적 해석 1. 집과 별 모양: 집: 집은 종종 안전, 안정, 가족,
                그리고 자신을 표현하는 상징으로 사용됩니다. 그림 속의 집은
                전면에 위치하고 있으며 문이 중앙에 있어 안정적이고 안전한 느낌을
                줍니다. 별 모양: 별은 희망, 소망, 꿈을 상징합니다. 집 위에 있는
                별은 이 집이 희망과 꿈을 담고 있다는 것을 나타낼 수 있습니다.
              </div>
            </div>
          </div>
        </div>
      </Background>
    </div>
  );
}
