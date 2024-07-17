import React from 'react';
import Background from '../components/Background';
import NavBar from '../components/NavBar';
import { Link } from 'react-router-dom';
import StyleButton from '../components/StyleButton';
function BusinessInputPage() {
  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-cover">
      <div className="relative h-full w-full">
        <Background>
          <NavBar />
          <div className="relative h-[67.5rem] w-[120rem]">
            <div className="flex h-full w-full items-start justify-center p-4">
              <textarea
                className="absolute left-[27rem] top-[27rem] h-[12.88rem] w-[68.63rem] resize-none overflow-auto rounded-[2.5rem] border-2 bg-gradient-to-b from-white/20 to-slate-400/10 p-2 text-3xl placeholder-violet-600 opacity-50 shadow outline-none backdrop-blur-xl"
                placeholder="ex) 회사명은 OO이고 어떤 유형의 회사입니다. (선택)"
              />
            </div>
            <div className="font-['Playfair Display'] absolute left-[24rem] top-[19.5rem] text-center text-5xl font-black text-white">
              비즈니스 유형을 알려주시면 보다 맞춤화된 옵션을 알려드릴게요!
            </div>
            <div>
              <Link to="/textinput">
                <button className="font-['Cafe24 Danjunghae'] absolute left-[83.1rem] top-[46.3rem] h-[5rem] w-[12.5rem] rounded-[2.5rem] bg-white/50 from-white/20 to-slate-400/10 text-center text-3xl font-normal text-white shadow backdrop-blur-xl hover:bg-white hover:text-black">
                  다음
                </button>
              </Link>
              <Link to="/pictureupload">
                <button className="font-['Cafe24 Danjunghae'] absolute left-[27rem] top-[46.3rem] h-[5rem] w-[12.5rem] rounded-[2.5rem] bg-white/50 text-center text-3xl font-normal text-white hover:bg-white hover:text-black">
                  이전
                </button>
              </Link>
            </div>
          </div>
        </Background>
      </div>
    </div>
  );
}

export default BusinessInputPage;
