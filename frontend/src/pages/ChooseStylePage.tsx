import React from 'react';
import Background from '../components/Background';
import NavBar from '../components/NavBar';
import Vector from '../components/Vector.png';

function ChooseStyle() {
  return (
    <Background>
      <NavBar />
      <div className="relative flex h-[40rem] w-[90rem] flex-col items-center rounded-[40px] border-2 border-white shadow">
        <div className="mt-8 text-3xl text-white">
          글꼴과 아이콘의 스타일을 선택해주세요!
        </div>
        <div className="mt-28 flex flex-col items-center justify-center gap-16">
          <div className="relative h-[0rem] w-[70rem] border-2 border-white">
            <button
              className="absolute -top-28 left-96 -translate-x-1/2 transform"
              style={{
                height: '8rem',
                width: '4rem',
                border: 'none',
                background: 'transparent',
              }}
              onClick={() => alert('Button Clicked')}
            >
              <img
                src={Vector}
                alt="Vector Icon"
                style={{ height: '100%', width: '100%' }}
              />
            </button>
            <button
              className="absolute -top-10 left-32 -translate-x-1/2 transform"
              style={{
                height: '8rem',
                width: '4rem',
                border: 'none',
                background: 'transparent',
              }}
              onClick={() => alert('Button Clicked')}
            >
              <img
                src={Vector}
                alt="Vector Icon"
                style={{ height: '100%', width: '100%' }}
              />
            </button>
          </div>
          <div className="relative h-[0rem] w-[70rem] border-2 border-white">
            <button
              className="absolute -top-28 left-1/2 -translate-x-1/2 transform"
              style={{
                height: '8rem',
                width: '4rem',
                border: 'none',
                background: 'transparent',
              }}
              onClick={() => alert('Button Clicked')}
            >
              <img
                src={Vector}
                alt="Vector Icon"
                style={{ height: '100%', width: '100%' }}
              />
            </button>
            <button
              className="absolute -top-16 left-60 -translate-x-1/2 transform"
              style={{
                height: '8rem',
                width: '4rem',
                border: 'none',
                background: 'transparent',
              }}
              onClick={() => alert('Button Clicked')}
            >
              <img
                src={Vector}
                alt="Vector Icon"
                style={{ height: '100%', width: '100%' }}
              />
            </button>
          </div>
          <div className="relative h-[0rem] w-[70rem] border-2 border-white">
            <button
              className="absolute -top-28 left-1/2 -translate-x-1/2 transform"
              style={{
                height: '8rem',
                width: '4rem',
                border: 'none',
                background: 'transparent',
              }}
              onClick={() => alert('Button Clicked')}
            >
              <img
                src={Vector}
                alt="Vector Icon"
                style={{ height: '100%', width: '100%' }}
              />
            </button>
            <button
              className="absolute -top-16 left-60 -translate-x-1/2 transform"
              style={{
                height: '8rem',
                width: '4rem',
                border: 'none',
                background: 'transparent',
              }}
              onClick={() => alert('Button Clicked')}
            >
              <img
                src={Vector}
                alt="Vector Icon"
                style={{ height: '100%', width: '100%' }}
              />
            </button>
          </div>
          <div className="relative h-[0rem] w-[70rem] border-2 border-white">
            <button
              className="absolute -top-16 left-60 -translate-x-1/2 transform"
              style={{
                height: '8rem',
                width: '4rem',
                border: 'none',
                background: 'transparent',
              }}
              onClick={() => alert('Button Clicked')}
            >
              <img
                src={Vector}
                alt="Vector Icon"
                style={{ height: '100%', width: '100%' }}
              />
            </button>
            <button
              className="absolute -top-16 left-60 -translate-x-1/2 transform"
              style={{
                height: '8rem',
                width: '4rem',
                border: 'none',
                background: 'transparent',
              }}
              onClick={() => alert('Button Clicked')}
            >
              <img
                src={Vector}
                alt="Vector Icon"
                style={{ height: '100%', width: '100%' }}
              />
            </button>
          </div>
          <div className="relative h-[0rem] w-[70rem] border-2 border-white">
            <button
              className="absolute -top-28 left-1/2 -translate-x-1/2 transform"
              style={{
                height: '8rem',
                width: '4rem',
                border: 'none',
                background: 'transparent',
              }}
              onClick={() => alert('Button Clicked')}
            >
              <img
                src={Vector}
                alt="Vector Icon"
                style={{ height: '100%', width: '100%' }}
              />
            </button>
            <button
              className="absolute -top-16 left-60 -translate-x-1/2 transform"
              style={{
                height: '8rem',
                width: '4rem',
                border: 'none',
                background: 'transparent',
              }}
              onClick={() => alert('Button Clicked')}
            >
              <img
                src={Vector}
                alt="Vector Icon"
                style={{ height: '100%', width: '100%' }}
              />
            </button>
          </div>
        </div>
        <div className=""></div>
      </div>
    </Background>
  );
}

export default ChooseStyle;
