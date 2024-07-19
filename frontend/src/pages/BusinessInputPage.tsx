import React, { FormEvent, useState } from 'react';
import { useRecoilState } from 'recoil';
import Background from '../components/Background';
import NavBar from '../components/NavBar';
import { businessInputState } from '../recoil/BusinessInputAtom';
import { Link } from 'react-router-dom';
import MoveButton from '../components/MoveButton';

function BusinessInputPage() {
  const [businessInput, setBusinessInput] = useRecoilState(businessInputState);
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    console.log('입력된 텍스트:', businessInput);
    setIsButtonClicked(true);
  };

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-cover">
      <Background>
        <NavBar />
        <div className="absolute h-[67.5rem] w-[120rem]">
          <div className="flex h-full w-full items-start justify-center p-4">
            <form onSubmit={handleSubmit}>
              <div className="left-[27rem] top-[27rem] h-[12.88rem] w-[68.63rem]">
                <textarea
                  className="absolute left-[27rem] top-[27rem] h-[12.88rem] w-[68.63rem] resize-none overflow-auto rounded-[2.5rem] border-2 bg-white bg-gradient-to-b from-white/20 to-slate-400/10 p-2 text-3xl placeholder-violet-600 opacity-50 shadow outline-none backdrop-blur-xl"
                  placeholder="ex) 회사명은 OO이고 어떤 유형의 회사입니다. (선택)"
                  value={businessInput}
                  onChange={(event) => setBusinessInput(event.target.value)}
                />
              </div>
              <Link to="/texi">
                <MoveButton
                  buttonText="다음"
                  className={`font-['Cafe24 Danjunghae'] absolute left-[83.1rem] top-[46.3rem] h-[5rem] w-[12.5rem] rounded-[2.5rem] bg-white/50 text-center text-3xl font-normal focus:outline-none ${isButtonClicked ? 'text-blue-800' : 'text-white'}`}
                />
              </Link>
            </form>
          </div>
          <div className="font-['Playfair Display'] absolute left-[33rem] top-[19.5rem] text-center text-5xl font-black text-white">
            <p className="mx-auto">
              비즈니스명을 알려주시면 로고에 넣어드릴게요!
            </p>
          </div>

          <MoveButton
            buttonText="이전"
            className="font-['Cafe24 Danjunghae'] absolute left-[27rem] top-[46.3rem] h-[5rem] w-[12.5rem] rounded-[2.5rem] bg-white/50 text-center text-3xl font-normal text-white"
          />
        </div>
      </Background>
    </div>
  );
}

export default BusinessInputPage;
