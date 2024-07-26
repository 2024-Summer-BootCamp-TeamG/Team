import React, { useState, FormEvent } from 'react';
import { useRecoilState } from 'recoil';
import Background from '../components/Background';
import NavBar from '../components/NavBar';
import { textInputState } from '../recoil/TextInputAtom';
import { businessInputState } from '../recoil/BusinessInputAtom';
<<<<<<< HEAD
import { Link } from 'react-router-dom';
import MoveButton from '../components/MoveButton';
=======
import { Link, useNavigate } from 'react-router-dom';
import Input from '../assets/Input.png';
import leftArrow from '../assets/leftArrow.svg';
import rightArrow from '../assets/rightArrow.svg';
>>>>>>> dev

function TextInputPage() {
  const [textInput, setTextInput] = useRecoilState(textInputState);
  const [businessInput, setBusinessInput] = useRecoilState(businessInputState);
<<<<<<< HEAD
  const [isButtonClicked, setIsButtonClicked] = useState(false);
=======
  const [isButtonClicked, setIsButtonClicked] = useState(false); // 버튼 클릭 상태를 관리하는 상태를 추가합니다.
  const navigate = useNavigate();
>>>>>>> dev

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('입력된 텍스트:', textInput);
    console.log('입력된 텍스트:', businessInput);
<<<<<<< HEAD
    setIsButtonClicked(true);
=======

    setIsButtonClicked(true); // 버튼이 클릭되었음을 표시합니다.
    navigate('/choosecolor'); // 다음 페이지로 이동
>>>>>>> dev
  };
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-cover">
      <Background>
        <NavBar />
<<<<<<< HEAD
        <div className="absolute h-[44rem] w-[120rem]">
          <div className="flex h-full w-full items-start justify-center p-4">
            <form onSubmit={handleSubmit}>
              <textarea
                className="absolute left-[27rem] top-[22rem] h-[12.88rem] w-[68.63rem] resize-none overflow-auto rounded-[2.5rem] border-2 bg-gradient-to-b from-white/20 to-slate-400/10 p-2 text-3xl placeholder-violet-600 opacity-50 shadow outline-none backdrop-blur-xl"
                placeholder="ex) STARBUCKS, 네네치킨 (선택)"
=======

        <div className="flex h-full w-full flex-col items-center justify-center p-4">
          <div className="font-['Cafe24 Danjunghae'] font-white mb-8 flex items-center justify-center text-center text-3xl text-white">
            포스터에 포함하고 싶은 텍스트를 입력해주세요
          </div>

          {/* 폼 제출 시 handleSubmit 함수가 호출됩니다. */}
          <div className="relative mb-8 flex flex-col items-center">
            <div
              className="z-0 flex h-full w-full items-center justify-center p-4"
              // style={{
              //   backgroundImage: `url(${Input})`,
              //   backgroundSize: 'cover',
              //   backgroundPosition: 'center',
              // }}
            >
              <textarea
                style={{
                  backgroundImage: `url(${Input})`,
                  paddingLeft: '2rem',
                  paddingRight: '1rem',
                  fontSize: '1.5rem',
                  color: 'white',
                }}
                className="h-[206px] w-[1098px] resize-none overflow-auto rounded-[2.5rem] bg-transparent placeholder-white"
                placeholder="ex) Hi This is Taeho Inc. Please visit our website!"
>>>>>>> dev
                value={textInput}
                onChange={(event) => setTextInput(event.target.value)}
              />
<<<<<<< HEAD
              <Link to="/choosecolor">
                <MoveButton
                  buttonText="다음"
                  className={`font-['Cafe24 Danjunghae'] h-[5rem] w-[12.5rem] rounded-[2.5rem] bg-white/50 text-center text-3xl font-normal focus:outline-none ${isButtonClicked ? 'text-blue-800' : 'text-white'}`}
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
=======
            </div>
            {/* <button type="button" className="flex flex-row items-center">
              <img
                className="h-[2.5rem] w-[2.5rem]"
                src={HomeIcon}
                alt="홈 아이콘"
              />
              <p className="ml-[5px] rounded text-[1.2rem] text-white">홈</p>
            </button> */}
            <div className="mt-2 mt-8 flex w-full justify-between px-4">
              <Link to="/busin">
                <button
                  type="button"
                  className="font-['Cafe24 Danjunghae'] hover:text-bermuda flex h-[5rem] w-[12.5rem] justify-center text-center text-3xl font-normal text-white"
                >
                  <img
                    className="h-[2.5rem] w-[2.5rem]"
                    src={leftArrow}
                    alt="이전"
                  />
                  <p>이전</p>
                </button>
              </Link>

              <Link to="/choosecolor">
                <button className="hover:text-bermuda font-['Cafe24 Danjunghae'] flex h-[5rem] w-[12.5rem] justify-center text-center text-3xl font-normal text-white">
                  다음
                  <img
                    className="h-[2.5rem] w-[2.5rem]"
                    src={rightArrow}
                    alt="다음"
                  />
                </button>
              </Link>
            </div>
          </div>
>>>>>>> dev
        </div>
      </Background>
    </div>
  );
}

export default TextInputPage;
