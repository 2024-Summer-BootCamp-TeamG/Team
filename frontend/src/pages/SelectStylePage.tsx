import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import Background from '../components/Background';
import NavBar from '../components/NavBar';
import StyleButton from '../components/StyleButton';
import { Link, useNavigate } from 'react-router-dom';
import { ChooseColorState } from '../recoil/ChooseColorAtom';
import { SelectStyleState } from '../recoil/SelectStyleAtom';
import { businessInputState } from '../recoil/BusinessInputAtom';
import {
  generatedLogoState,
  generatedPosterState,
  generatedMusicState,
} from '../recoil/GeneratedAtom';
import { textInputState } from '../recoil/TextInputAtom';
import axios from 'axios';
import leftArrow from '../assets/leftArrow.svg';
import rightArrow from '../assets/rightArrow.svg';

function SelectStylePage() {
  const [selectedButton, setSelectedButton] = useRecoilState(SelectStyleState);
  const [color, setColor] = useRecoilState(ChooseColorState);
  const [logoText, setLogoText] = useRecoilState(businessInputState);
  const [posterText, setPosterText] = useRecoilState(textInputState);
  const setGeneratedLogo = useSetRecoilState(generatedLogoState);
  const setGeneratedPoster = useSetRecoilState(generatedPosterState);
  // const setGeneratedMusic = useSetRecoilState(generatedMusicState);
  const progressRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedMusic, setGeneratedMusic] =
    useRecoilState(generatedMusicState);

  // 특정 버튼의 선택 상태 토글 함수
  const toggleButton = (buttonText: string) => {
    setSelectedButton((prevSelected) => {
      const newSelected = prevSelected === buttonText ? '' : buttonText;
      console.log('Button selected:', newSelected);
      return newSelected;
    });
  };

  const handleGenerateClick = async () => {
    if (isLoading) return; // 이미 요청 중이면 무시

    setIsLoading(true); // 요청 시작
    try {
      const [logoResponse, posterResponse, musicResponse] = await Promise.all([
        axios.post(
          'http://localhost:8000/prompts/generate_logo/',
          {
            style: selectedButton,
            color: color,
            logo_text: logoText,
          },
          {
            withCredentials: true,
          },
        ),

        axios.post(
          'http://localhost:8000/prompts/generate_poster/',
          {
            style: selectedButton,
            color: color,
            poster_user_text: posterText,
          },
          {
            withCredentials: true,
          },
        ),

        axios.post(
          'http://localhost:8000/prompts/generate_music/',
          {},
          {
            withCredentials: true,
          },
        ),
      ]);
      console.log('Logo API Response:', logoResponse.data);
      console.log('Poster API Response:', posterResponse.data);
      console.log('Music API Response:', musicResponse.data);

      if (
        logoResponse.status === 201 &&
        posterResponse.status === 201 &&
        musicResponse.status === 201
      ) {
        setGeneratedLogo(logoResponse.data.logo_url);
        setGeneratedPoster(posterResponse.data.poster_url);
        setGeneratedMusic(musicResponse.data.music_url); // 변경된 부분
        // setMusicUrl(musicResponse.data.music_url); // 음악 URL 설정

        alert('로고, 포스터, 음악이 성공적으로 생성되었습니다.');
        navigate('/logomusic');
      } else {
        alert('로고, 포스터 또는 음악 생성에 실패했습니다.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorMessage =
            error.response.data.detail || JSON.stringify(error.response.data);
          alert(
            `로고, 포스터 또는 음악 생성 도중 오류가 발생했습니다: ${errorMessage}`,
          );
        } else {
          alert('로고, 포스터 또는 음악 생성 도중 오류가 발생했습니다.');
        }
        console.error('There was an error!', error);
      } else {
        alert(
          '로고, 포스터 또는 음악 생성 도중 예기치 않은 오류가 발생했습니다.',
        );
        console.error('There was an unexpected error!', error);
      }
    } finally {
      setIsLoading(false); // 요청 완료
    }
  };

  useEffect(() => {
    if (isLoading) {
      let counter = 0;
      let progress = 0;
      const intervalId = setInterval(() => {
        if (counter >= 100) {
          clearInterval(intervalId);
        } else {
          progress += 5;
          counter += 1;
          if (progressRef.current) {
            progressRef.current.style.width = progress + 'px';
          }
          if (percentRef.current) {
            percentRef.current.textContent = counter + '%';
          }
        }
      }, 300);
    }
  }, [isLoading]);

  useEffect(() => {
    // if (setGeneratedMusic) {
    //   const audio = new Audio(setGeneratedMusic);
    //   audio.play().catch((error) => {
    //     console.error('Failed to play the audio', error);
    //   });
    // }
  }, [setGeneratedMusic]);

  // If loading, display the loading screen
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="flex w-[550px] flex-col items-center justify-center rounded-lg bg-black p-8">
          <div className="py-8 text-[2.5rem] font-semibold text-[#8AAAFF]">
            <span ref={percentRef}>0%</span>
          </div>
          <div className="relative mx-auto h-[10px] w-[500px] overflow-hidden rounded-full bg-blue-200">
            <div
              ref={progressRef}
              className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-[#8AAAFF] to-[#FA8CFF]"
            ></div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-[#000000] bg-cover">
      <div className="relative h-full w-full">
        <Background>
          <NavBar />
          <div className="flex items-center justify-center">
            <div className="w-auto flex-col items-center justify-center space-y-8">
              <div className="mx-auto flex w-3/4 flex-row justify-between space-x-12">
                <StyleButton
                  className={`h-[9rem] w-[21rem] ${selectedButton === '모던한' ? 'selected' : ''}`}
                  buttonText="모던한"
                  isSelected={selectedButton === '모던한'}
                  onToggle={() => toggleButton('모던한')}
                />
                <StyleButton
                  className={`h-[9rem] w-[21rem] ${selectedButton === '장난스러운' ? 'selected' : ''}`}
                  buttonText="장난스러운"
                  isSelected={selectedButton === '장난스러운'}
                  onToggle={() => toggleButton('장난스러운')}
                />
                <StyleButton
                  className={`h-[9rem] w-[21rem] ${selectedButton === '재미난' ? 'selected' : ''}`}
                  buttonText="재미난"
                  isSelected={selectedButton === '재미난'}
                  onToggle={() => toggleButton('재미난')}
                />
              </div>
              <div className="mx-auto flex w-auto flex-row justify-between space-x-4">
                <StyleButton
                  className={`h-[9rem] w-[21rem] ${selectedButton === '간단한' ? 'selected' : ''}`}
                  buttonText="간단한"
                  isSelected={selectedButton === '간단한'}
                  onToggle={() => toggleButton('간단한')}
                />
                <StyleButton
                  className={`h-[9rem] w-[21rem] ${selectedButton === '다이나믹한' ? 'selected' : ''}`}
                  buttonText="다이나믹한"
                  isSelected={selectedButton === '다이나믹한'}
                  onToggle={() => toggleButton('다이나믹한')}
                />
                <StyleButton
                  className={`h-[9rem] w-[21rem] ${selectedButton === '공식적인' ? 'selected' : ''}`}
                  buttonText="공식적인"
                  isSelected={selectedButton === '공식적인'}
                  onToggle={() => toggleButton('공식적인')}
                />
                <StyleButton
                  className={`h-[9rem] w-[21rem] ${selectedButton === '고급진' ? 'selected' : ''}`}
                  buttonText="고급진"
                  isSelected={selectedButton === '고급진'}
                  onToggle={() => toggleButton('고급진')}
                />
              </div>
              <div className="mx-auto flex w-3/4 flex-row justify-between space-x-12">
                <StyleButton
                  className={`h-[9rem] w-[21rem] ${selectedButton === '창의적인' ? 'selected' : ''}`}
                  buttonText="창의적인"
                  isSelected={selectedButton === '창의적인'}
                  onToggle={() => toggleButton('창의적인')}
                />
                <StyleButton
                  className={`h-[9rem] w-[21rem] ${selectedButton === '힙한' ? 'selected' : ''}`}
                  buttonText="힙한"
                  isSelected={selectedButton === '힙한'}
                  onToggle={() => toggleButton('힙한')}
                />
                <StyleButton
                  className={`h-[9rem] w-[21rem] ${selectedButton === '귀여운' ? 'selected' : ''}`}
                  buttonText="귀여운"
                  isSelected={selectedButton === '귀여운'}
                  onToggle={() => toggleButton('귀여운')}
                />
              </div>
              <div className="mt-2 mt-8 flex w-full justify-between px-4">
                <Link to="/busin">
                  <button
                    type="button"
                    className="font-['Cafe24 Danjunghae'] flex h-[5rem] w-[12.5rem] justify-center text-center text-3xl font-normal text-white hover:text-bermuda"
                  >
                    <img
                      className="h-[2.5rem] w-[2.5rem]"
                      src={leftArrow}
                      alt="홈 아이콘"
                    />
                    <p>이전</p>
                  </button>
                </Link>

                <Link to="/selectstyle">
                  <button
                    onClick={handleGenerateClick}
                    className="font-['Cafe24 Danjunghae'] flex h-[5rem] w-[12.5rem] justify-center text-center text-3xl font-normal text-white hover:text-bermuda"
                  >
                    생성
                    <img
                      className="h-[2.5rem] w-[2.5rem]"
                      src={rightArrow}
                      alt="홈 아이콘"
                    />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </Background>
      </div>
    </div>
  );
}
export default SelectStylePage;
