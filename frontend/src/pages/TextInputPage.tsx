import { useState, FormEvent } from 'react';
import { useRecoilState } from 'recoil';
import Background from '../components/Background';
import NavBar from '../components/NavBar';
import { textInputState } from '../recoil/TextInputAtom';
import { businessInputState } from '../recoil/BusinessInputAtom';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../assets/Input.png';
import leftArrow from '../assets/leftArrow.svg';
import rightArrow from '../assets/rightArrow.svg';

function TextInputPage() {
  const [textInput, setTextInput] = useRecoilState(textInputState);
  const [businessInput, setBusinessInput] = useRecoilState(businessInputState);
  const [isButtonClicked, setIsButtonClicked] = useState(false); // 버튼 클릭 상태를 관리하는 상태를 추가합니다.
  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // 폼 제출의 기본 동작을 막습니다.
    console.log('입력된 텍스트:', textInput);
    console.log('입력된 텍스트:', businessInput);

    setIsButtonClicked(true); // 버튼이 클릭되었음을 표시합니다.
    navigate('/choosecolor'); // 다음 페이지로 이동
  };
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-cover">
      <Background>
        <NavBar />

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
                value={textInput}
                onChange={(event) => setTextInput(event.target.value)}
              />
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
                  className="font-['Cafe24 Danjunghae'] flex h-[5rem] w-[12.5rem] justify-center text-center text-3xl font-normal text-white hover:text-bermuda"
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
                <button className="font-['Cafe24 Danjunghae'] flex h-[5rem] w-[12.5rem] justify-center text-center text-3xl font-normal text-white hover:text-bermuda">
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
        </div>
      </Background>
    </div>
  );
}

export default TextInputPage;
