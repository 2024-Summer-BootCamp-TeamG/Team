import { useRecoilState } from 'recoil';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Background from '../../components/Background';
import NavBar from '../../components/NavBar';
import ProgressSteps from '../../components/ProgressSteps';

import { currentStepState } from '../../recoil/StepStateAtom';
import { businessInputState } from '../../recoil/BusinessInputAtom';
import Input from '../../assets/Input.png';
import leftArrow from '../../assets/leftArrow.svg';
import rightArrow from '../../assets/rightArrow.svg';

function BusinessInputPage() {
  const [currentStep, setCurrentStep] = useRecoilState(currentStepState);
  const [businessInput, setBusinessInput] = useRecoilState(businessInputState);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentStep(1); // step1
  }, [setCurrentStep]);

  const nextStep = () => {
    navigate('/textinput');
  };

  const prevStep = () => {
    navigate('/previousPage');
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-cover">
      <Background>
        <NavBar />
        <div>
          <ProgressSteps currentStep={currentStep} />

          <div className="flex h-full w-full flex-col items-center justify-center p-4">
            <div className="font-['Cafe24 Danjunghae'] font-white mb-8 flex items-center justify-center text-center text-3xl text-white">
              로고에 들어갈 기업명과 상품명을 알려주세요!
            </div>

            <div className="relative mb-8 flex flex-col items-center">
              <div className="z-0 flex h-full w-full items-center justify-center p-4">
                <textarea
                  style={{
                    backgroundImage: `url(${Input})`,
                  }}
                  className="h-[206px] w-[1098px] resize-none overflow-auto rounded-[2.5rem] bg-transparent bg-no-repeat pl-8 pr-4 text-[1.5rem] text-white placeholder-white"
                  placeholder="ex) Taeho Inc."
                  value={businessInput}
                  onChange={(event) => setBusinessInput(event.target.value)}
                />
              </div>

              <div className="mt-2 mt-8 flex w-full justify-between px-4">
                <Link to="/pictureupload">
                  <button
                    type="button"
                    className="font-['Cafe24 Danjunghae'] flex h-[5rem] w-[12.5rem] justify-center text-center text-3xl font-normal text-white hover:text-bermuda"
                    onClick={prevStep}
                  >
                    <img
                      className="h-[2.5rem] w-[2.5rem]"
                      src={leftArrow}
                      alt="이전"
                    />
                    <p>이전</p>
                  </button>
                </Link>

                <Link to="/textinput">
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

export default BusinessInputPage;
