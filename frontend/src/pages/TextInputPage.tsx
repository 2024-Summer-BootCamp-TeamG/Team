import React, { useState, FormEvent } from 'react';
import { useRecoilState } from 'recoil';
import Background from '../components/Background';
import NavBar from '../components/NavBar';
import { textInputState } from '../recoil/TextInputAtom';
import { businessInputState } from '../recoil/BusinessInputAtom';
import { Link } from 'react-router-dom';
import MoveButton from '../components/MoveButton';

function TextInputPage() {
  const [textInput, setTextInput] = useRecoilState(textInputState);
  const [businessInput, setBusinessInput] = useRecoilState(businessInputState);
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('입력된 텍스트:', textInput);
    console.log('입력된 텍스트:', businessInput);
    setIsButtonClicked(true);
  };

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-cover">
      <Background>
        <NavBar />
        <div className="absolute h-[44rem] w-[120rem]">
          <div className="flex h-full w-full items-start justify-center p-4">
            <form onSubmit={handleSubmit}>
              <textarea
                className="absolute left-[27rem] top-[22rem] h-[12.88rem] w-[68.63rem] resize-none overflow-auto rounded-[2.5rem] border-2 bg-gradient-to-b from-white/20 to-slate-400/10 p-2 text-3xl placeholder-violet-600 opacity-50 shadow outline-none backdrop-blur-xl"
                placeholder="ex) STARBUCKS, 네네치킨 (선택)"
                value={textInput}
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setTextInput(event.target.value)
                }
              />
              <Link to="/choosecolor">
                <MoveButton
                  buttonText="다음"
                  className={`font-['Cafe24 Danjunghae'] absolute left-[83.1rem] top-[40rem] h-[5rem] w-[12.5rem] rounded-[2.5rem] bg-white/50 text-center text-3xl font-normal focus:outline-none ${isButtonClicked ? 'text-blue-800' : 'text-white'}`}
                />
              </Link>
            </form>
          </div>
          <div className="font-['Playfair Display'] absolute left-[33rem] top-[15rem] text-center text-5xl font-black text-white">
            포스터에 포함하고 싶은 텍스트를 입력해주세요!
          </div>
          <Link to="/busin">
            <MoveButton
              buttonText="이전"
              className="font-['Cafe24 Danjunghae'] absolute left-[27rem] top-[40rem] h-[5rem] w-[12.5rem] rounded-[2.5rem] bg-white/50 text-center text-3xl font-normal text-white"
            />
          </Link>
        </div>
      </Background>
    </div>
  );
}

export default TextInputPage;
