import React from 'react';
import Background from '../components/Background';
import NavBar from '../components/NavBar';

function TextInputPage() {
  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-cover">
      <Background>
        <NavBar />
        <div className="relative h-[67.5rem] w-[120rem] bg-black">
          <div className="flex h-full w-full items-start justify-center p-4">
            <textarea
              className="absolute left-[27rem] top-[27rem] h-[12.88rem] w-[68.63rem] resize-none overflow-auto rounded-[2.5rem] border-2 bg-gradient-to-b from-white/20 to-slate-400/10 p-2 text-3xl placeholder-violet-600 opacity-50 shadow outline-none backdrop-blur-xl"
              placeholder="ex) ex) STARBUCKS, 네네치킨 (선택)"
            />
          </div>
          <div className="font-['Playfair Display'] absolute left-[33rem] top-[19.5rem] text-center text-5xl font-black text-white">
            포스터에 포함하고 싶은 텍스트를 입력해주세요!
          </div>
          <button className="font-['Cafe24 Danjunghae'] absolute left-[83.1rem] top-[46.3rem] h-[5rem] w-[12.5rem] rounded-[2.5rem] bg-white/50 text-center text-3xl font-normal text-white">
            다음
          </button>
          <button className="font-['Cafe24 Danjunghae'] absolute left-[27rem] top-[46.3rem] h-[5rem] w-[12.5rem] rounded-[2.5rem] bg-white/50 text-center text-3xl font-normal text-white">
            이전
          </button>
        </div>
      </Background>
    </div>
  );
}

export default TextInputPage;
