import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { Link, useNavigate } from 'react-router-dom';

import Background from '../../components/Background';
import NavBar from '../../components/NavBar';
import ProgressSteps from '../../components/ProgressSteps';

import { currentStepState } from '../../recoil/StepStateAtom';
import { textInputState } from '../../recoil/TextInputAtom';

import Input from '../../assets/Input.png';
import leftArrow from '../../assets/leftArrow.svg';
import rightArrow from '../../assets/rightArrow.svg';

function TextInputPage() {
  const [currentStep, setCurrentStep] = useRecoilState(currentStepState);
  const [textInput, setTextInput] = useRecoilState(textInputState);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentStep(2); //step2
  }, [setCurrentStep]);

  const nextStep = () => {
    navigate('/choosecolor');
  };

  const prevStep = () => {
    navigate('/busin');
  };

  // };
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-cover">
      <Background>
        <NavBar />
        <div>
          <div className="flex h-full w-full flex-col items-center justify-center p-4">
            <ProgressSteps currentStep={currentStep} />

            <div className="font-['Cafe24 Danjunghae'] font-white mb-8 flex items-center justify-center text-center text-3xl text-white">
              포스터에 포함하고 싶은 텍스트를 입력해주세요
            </div>

            <div className="relative mb-8 flex flex-col items-center">
              <div className="z-0 flex h-full w-full items-center justify-center p-4">
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
              <div className="mt-2 mt-8 flex w-full justify-between px-4">
                <Link to="/business">
                  <button
                    type="button"
                    onClick={prevStep}
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
                  <button
                    onClick={nextStep}
                    className="font-['Cafe24 Danjunghae'] flex h-[5rem] w-[12.5rem] justify-center text-center text-3xl font-normal text-white hover:text-bermuda"
                  >
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
        </div>
      </Background>
    </div>
  );
}

export default TextInputPage;
