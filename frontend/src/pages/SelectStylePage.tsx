import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import Background from '../components/Background';
import NavBar from '../components/NavBar';
import { useNavigate } from 'react-router-dom';
import { ChooseColorState } from '../recoil/ChooseColorAtom';
import { SelectStyleState } from '../recoil/SelectStyleAtom';
import { businessInputState } from '../recoil/BusinessInputAtom';
import { textInputState } from '../recoil/TextInputAtom';
import axios from 'axios';
import axiosInstance from '../api/axios';
import Vector from '../assets/Vectornote.svg';
import VectorClicked from '../assets/BlueNote.svg';
import rightArrow from '../assets/rightArrow.svg';
import leftArrow from '../assets/leftArrow.svg';
import NoNoteBackground from '../components/NoNoteBackground';
import { currentStepState } from '../recoil/StepStateAtom';
import {
  generatedLogoState,
  generatedPosterState,
  generatedMusicState,
} from '../recoil/GeneratedAtom';
import ProgressSteps from '../components/ProgressSteps';
import './ChooseStyle.css'; // CSS 파일 임포트

function SelectStylePage() {
  const [currentStep, setCurrentStep] = useRecoilState(currentStepState);
  const [selectedButton, setSelectedButton] = useRecoilState(SelectStyleState);
  const [color] = useRecoilState(ChooseColorState);
  const [logoText] = useRecoilState(businessInputState);
  const [posterText] = useRecoilState(textInputState);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [generatedMusic, setGeneratedMusic] =
    useRecoilState(generatedMusicState);
  const [, setGeneratedLogo] = useRecoilState(generatedLogoState);
  const [, setGeneratedPoster] = useRecoilState(generatedPosterState);
  const [, setTaskId] = useState<string | null>(null);
  const [, setUserId] = useState<string | null>(null);

  const handleStyleClick = (style: any) => {
    setSelectedButton(style);
    console.log('버튼 선택됨:', style);
  };

  useEffect(() => {
    setCurrentStep(4); // Set the current step to 4 for this page
  }, [setCurrentStep]);

  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    console.log(storedUserId);
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      alert('로그인 정보가 없습니다. 로그인 페이지로 이동합니다.');
      navigate('/signin');
    }
  }, [navigate]);

  const generateLogoAndPoster = async () => {
    try {
      console.log('Generating logo and poster with:', {
        style: selectedButton,
        color: color,
        logo_text: logoText,
        poster_user_text: posterText,
      });
      const [logoResponse, posterResponse] = await Promise.all([
        axiosInstance.post(
          '/prompts/generate_logo',
          {
            style: selectedButton,
            color: color,
            logo_text: logoText,
          },
          {
            withCredentials: true,
          },
        ),
        axiosInstance.post(
          'prompts/generate_poster',
          {
            style: selectedButton,
            color: color,
            poster_user_text: posterText,
          },
          {
            withCredentials: true,
          },
        ),
      ]);
      if (logoResponse.status === 201 && posterResponse.status === 201) {
        setGeneratedLogo(logoResponse.data.logo_url);
        setGeneratedPoster(posterResponse.data.poster_url);
        console.log('logo:', logoResponse.data.logo_url);
        console.log('poster', posterResponse.data.poster_url);
        return true;
      } else {
        console.log(logoResponse.status);
        console.log(posterResponse.status);
        alert('로고 또는 포스터 생성에 실패했습니다.');
        return false;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorMessage =
            error.response.data.detail || JSON.stringify(error.response.data);
          console.log(JSON.stringify(error.response.data));
          alert(`로고 생성 도중 오류가 발생했습니다: ${errorMessage}`);
        } else {
          alert('로고 생성 도중 오류가 발생했습니다.');
        }
        console.error('There was an error!', error);
      } else {
        alert('로고 생성 도중 예기치 않은 오류가 발생했습니다.');
        console.error('There was an unexpected error!', error);
      }
    }
  };

  useEffect(() => {
    const storedTaskId = localStorage.getItem('task_id');
    if (storedTaskId) {
      setTaskId(storedTaskId);
      generateMusic(storedTaskId);
    } else {
      alert('유효하지 않은 작업 ID입니다.');
      navigate('/pictureupload');
    }
  }, [navigate]);

  const generateMusic = async (taskId: string) => {
    try {
      const response = await axios.get(
        `/prompts/generate_textandmusic/${taskId}`,
        {
          withCredentials: true,
        },
      );
      if (response.status === 200) {
        const { task_status, analysis_result, clip_url } = response.data;
        if (clip_url) {
          console.log('생성완료', task_status);
          console.log('결과:', analysis_result);
          console.log('결과:', response.data);
          console.log('음악 결과:', clip_url);
          setGeneratedMusic(clip_url);
          console.log('이건 음악임:', generatedMusic);
          alert('성공');
          navigate('/logomusic');
          setIsLoading(false);
        } else if (clip_url === undefined) {
          console.log('대기 중', task_status);
          setTimeout(() => generateMusic(taskId), 5000);
          console.log(analysis_result);
          console.log('넌 뭐야2', task_status);
        }
      } else {
        console.log(response.status);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorMessage =
            error.response.data.detail || JSON.stringify(error.response.data);
          console.log(JSON.stringify(error.response.data));
          alert(`음악 생성 도중 오류가 발생했습니다: ${errorMessage}`);
        } else {
          alert('음악 생성 도중 오류가 발생했습니다.');
        }
        console.error('There was an error!', error);
      } else {
        alert('음악 생성 도중 예기치 않은 오류가 발생했습니다.');
        console.error('There was an unexpected error!', error);
      }
    }
  };

  const handleGenerateClick = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const logoAndPosterSuccess = await generateLogoAndPoster();
    if (logoAndPosterSuccess) {
      const taskId = localStorage.getItem('task_id');
      if (taskId) {
        await generateMusic(taskId);
      } else {
        alert('유효하지 않은 작업 ID입니다.');
        navigate('/pictureupload');
      }
    }
    setIsLoading(false);
  };

  const getIcon = (style: string) => {
    return selectedButton === style ? VectorClicked : Vector;
  };

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-[#000000] bg-cover">
      <div className="relative h-full w-full">
        <NoNoteBackground>
          <NavBar />
          <div>
            <ProgressSteps currentStep={currentStep} />

            <div className="relative mt-12 flex h-[28rem] w-[70rem] flex-col items-center rounded-[40px] border-2 border-white shadow">
              <div className="mt-8 text-3xl text-white">
                글꼴과 아이콘의 스타일을 선택해주세요!
              </div>
              <div className="mt-20 flex flex-col items-center justify-center gap-16">
                <div className="button-container">
                  <div className="z-1 border-1 relative h-[0rem] w-[60rem] border-white">
                    <div className="z-2 absolute left-1/2 top-6 flex -translate-x-1/2 transform flex-col items-center">
                      <button
                        className={`style-button ${selectedButton === '모던한' ? 'selected' : ''}`}
                        onClick={() => handleStyleClick('모던한')}
                      >
                        <img
                          src={getIcon('모던한')}
                          alt="Vector Icon"
                          className="style-icon"
                        />
                      </button>
                      <div className="style-text mt-2 text-center text-white">
                        모던한
                      </div>
                    </div>
                    <div className="absolute -top-10 left-96 flex -translate-x-1/2 transform flex-col items-center">
                      <button
                        className={`style-button ${selectedButton === '공식적인' ? 'selected' : ''}`}
                        onClick={() => handleStyleClick('공식적인')}
                      >
                        <img
                          src={getIcon('공식적인')}
                          alt="Vector Icon"
                          className="style-icon"
                        />
                      </button>
                      <div className="style-text mt-2 text-center text-white">
                        공식적인
                      </div>
                    </div>
                  </div>
                  <div className="relative h-[0rem] w-[60rem] border-2 border-white">
                    <div className="absolute right-80 top-5 flex -translate-x-1/2 transform flex-col items-center">
                      <button
                        className={`style-button ${selectedButton === '귀여운' ? 'selected' : ''}`}
                        onClick={() => handleStyleClick('귀여운')}
                      >
                        <img
                          src={getIcon('귀여운')}
                          alt="Vector Icon"
                          className="style-icon"
                        />
                      </button>
                      <div className="style-text mt-2 text-center text-white">
                        귀여운
                      </div>
                    </div>
                    <div className="absolute -top-12 left-64 flex -translate-x-1/2 transform flex-col items-center">
                      <button
                        className={`style-button ${selectedButton === '고급진' ? 'selected' : ''}`}
                        onClick={() => handleStyleClick('고급진')}
                      >
                        <img
                          src={getIcon('고급진')}
                          alt="Vector Icon"
                          className="style-icon"
                        />
                      </button>
                      <div className="style-text mt-2 text-center text-white">
                        고급진
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative h-[0rem] w-[60rem] border-2 border-white">
                  <div className="absolute -top-28 right-48 flex -translate-x-1/2 transform flex-col items-center">
                    <button
                      className={`style-button ${selectedButton === '창의적인' ? 'selected' : ''}`}
                      onClick={() => handleStyleClick('창의적인')}
                    >
                      <img
                        src={getIcon('창의적인')}
                        alt="Vector Icon"
                        className="style-icon"
                      />
                    </button>
                    <div className="style-text mt-2 text-center text-white">
                      창의적인
                    </div>
                  </div>
                  <div className="absolute -top-12 left-36 flex -translate-x-1/2 transform flex-col items-center">
                    <button
                      className={`style-button ${selectedButton === '재미난' ? 'selected' : ''}`}
                      onClick={() => handleStyleClick('재미난')}
                    >
                      <img
                        src={getIcon('재미난')}
                        alt="Vector Icon"
                        className="style-icon"
                      />
                    </button>
                    <div className="style-text mt-2 text-center text-white">
                      재미난
                    </div>
                  </div>
                </div>
                <div className="relative h-[0rem] w-[60rem] border-2 border-white">
                  <div className="absolute -top-64 right-20 flex -translate-x-1/2 transform flex-col items-center">
                    <button
                      className={`style-button ${selectedButton === '간단한' ? 'selected' : ''}`}
                      onClick={() => handleStyleClick('간단한')}
                    >
                      <img
                        src={getIcon('간단한')}
                        alt="Vector Icon"
                        className="style-icon"
                      />
                    </button>
                    <div className="style-text mt-2 text-center text-white">
                      간단한
                    </div>
                  </div>
                  <div className="absolute -top-12 left-7 flex -translate-x-1/2 transform flex-col items-center justify-center">
                    <button
                      className={`style-button ${selectedButton === '장난스러운' ? 'selected' : ''}`}
                      onClick={() => handleStyleClick('장난스러운')}
                    >
                      <img
                        src={getIcon('장난스러운')}
                        alt="Vector Icon"
                        className="style-icon"
                      />
                    </button>
                    <div className="style-text mt-2 text-center text-white">
                      장난스러운
                    </div>
                  </div>
                </div>
                <div className="relative h-[0rem] w-[60rem] border-2 border-white">
                  <div className="absolute -right-10 -top-64 flex -translate-x-1/2 transform flex-col items-center justify-center">
                    <button
                      className={`style-button ${selectedButton === '다이나믹한' ? 'selected' : ''}`}
                      onClick={() => handleStyleClick('다이나믹한')}
                    >
                      <img
                        src={getIcon('다이나믹한')}
                        alt="Vector Icon"
                        className="style-icon"
                      />
                    </button>
                    <div className="style-text mt-2 text-center text-white">
                      다이나믹한
                    </div>
                  </div>
                </div>
                <div className="mt-12 flex w-full flex-row justify-between">
                  <button
                    className="font-['Cafe24 Danjunghae'] flex h-[5rem] w-[12.5rem] justify-center text-center text-3xl font-normal text-white hover:text-bermuda"
                    onClick={() => navigate('/choosecolor')}
                  >
                    <div className="flex text-white">
                      {' '}
                      <img
                        className="h-[2.5rem] w-[2.5rem]"
                        src={leftArrow}
                        alt="이전"
                      />
                      <p className="hover:text-bermuda">이전</p>
                    </div>
                  </button>
                  <button
                    className="font-['Cafe24 Danjunghae'] flex h-[5rem] w-[12.5rem] justify-center text-center text-3xl font-normal text-white hover:text-bermuda"
                    onClick={handleGenerateClick}
                    disabled={isLoading}
                  >
                    <div className="flex text-white">
                      <span className={isLoading ? '' : 'hover:text-bermuda'}>
                        {isLoading ? '생성 중...' : '다음'}
                      </span>
                      <img
                        className="h-[2.5rem] w-[2.5rem]"
                        src={rightArrow}
                        alt="다음"
                      />
                      <p className="hover:text-bermuda"></p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </NoNoteBackground>
      </div>
    </div>
  );
}

export default SelectStylePage;
