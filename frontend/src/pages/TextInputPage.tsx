import React, { useState, FormEvent } from 'react';
import { useRecoilState } from 'recoil';
import Background from '../components/Background';
import NavBar from '../components/NavBar';
import { textInputState } from '../recoil/TextInputAtom';
import { businessInputState } from '../recoil/BusinessInputAtom';
import { Link } from 'react-router-dom';

function TextInputPage() {
  const [textInput, setTextInput] = useRecoilState(textInputState);
  const [businessInput, setBusinessInput] = useRecoilState(businessInputState);
  const [isButtonClicked, setIsButtonClicked] = useState(false); // 버튼 클릭 상태를 관리하는 상태를 추가합니다.

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // 폼 제출의 기본 동작을 막습니다.
    console.log('입력된 텍스트:', textInput);
    console.log('입력된 텍스트:', businessInput);
    setIsButtonClicked(true); // 버튼이 클릭되었음을 표시합니다.

    // 여기에 다음 버튼을 클릭했을 때 실행할 코드를 추가하세요.
    // 예를 들어, 다음 페이지로 이동하거나, 서버에 데이터를 전송하는 등의 작업을 수행할 수 있습니다.
  };

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-cover">
      <Background>
        <NavBar />
        <div className="relative h-[67.5rem] w-[120rem]">
          <div className="flex h-full w-full items-start justify-center p-4">
            <form onSubmit={handleSubmit}>
              {' '}
              {/* 폼 제출 시 handleSubmit 함수가 호출됩니다. */}
              <textarea
                className="absolute left-[27rem] top-[27rem] h-[12.88rem] w-[68.63rem] resize-none overflow-auto rounded-[2.5rem] border-2 bg-gradient-to-b from-white/20 to-slate-400/10 p-2 text-3xl placeholder-violet-600 opacity-50 shadow outline-none backdrop-blur-xl"
                placeholder="ex) STARBUCKS, 네네치킨 (선택)"
                value={textInput}
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setTextInput(event.target.value)
                }
              />
              <Link to="/choosecolor">
                <input
                  type="submit"
                  value="다음"
                  className={`font-['Cafe24 Danjunghae'] absolute left-[83.1rem] top-[46.3rem] h-[5rem] w-[12.5rem] rounded-[2.5rem] bg-white/50 text-center text-3xl font-normal focus:outline-none ${isButtonClicked ? 'text-blue-800' : 'text-white'}`}
                />
              </Link>
            </form>
          </div>
          <div className="font-['Playfair Display'] absolute left-[33rem] top-[19.5rem] text-center text-5xl font-black text-white">
            포스터에 포함하고 싶은 텍스트를 입력해주세요!
          </div>
          <Link to="/busin">
            <button className="font-['Cafe24 Danjunghae'] absolute left-[27rem] top-[46.3rem] h-[5rem] w-[12.5rem] rounded-[2.5rem] bg-white/50 text-center text-3xl font-normal text-white">
              이전
            </button>
          </Link>
        </div>
      </Background>
    </div>
  );
}

export default TextInputPage;
