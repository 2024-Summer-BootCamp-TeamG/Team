import React, { useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import Background from '../components/Background';
import NavBar from '../components/NavBar';
import StyleButton from '../components/StyleButton';
import MoveButton from '../components/MoveButton';
import { Link, useNavigate } from 'react-router-dom';
import { ChooseColorState } from '../recoil/ChooseColorAtom';
import { SelectStyleState } from '../recoil/SelectStyleAtom';
import { businessInputState } from '../recoil/BusinessInputAtom';
import { textInputState } from '../recoil/TextInputAtom';
import axios from 'axios';

function SelectStylePage() {
  const [selectedButton, setSelectedButton] = useRecoilState(SelectStyleState);
  const [color] = useRecoilState(ChooseColorState);
  const [logoText] = useRecoilState(businessInputState);
  const [posterText] = useRecoilState(textInputState);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const progressRef = useRef<HTMLDivElement | null>(null);
  const percentRef = useRef<HTMLSpanElement | null>(null);

  const toggleButton = (buttonText: string) => {
    setSelectedButton((prevSelected) => {
      const newSelected = prevSelected === buttonText ? '' : buttonText;
      console.log('Button selected:', newSelected);
      return newSelected;
    });
  };

  const handleGenerateClick = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const [logoResponse, posterResponse] = await Promise.all([
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
      ]);

      console.log('Logo API Response:', logoResponse.data);
      console.log('Poster API Response:', posterResponse.data);

      if (logoResponse.status === 201 && posterResponse.status === 201) {
        alert('로고와 포스터가 성공적으로 생성되었습니다.');
        navigate('/logomusic');
      } else {
        alert('로고 또는 포스터 생성에 실패했습니다.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorMessage =
            error.response.data.detail || JSON.stringify(error.response.data);
          alert(
            `로고 또는 포스터 생성 도중 오류가 발생했습니다: ${errorMessage}`,
          );
        } else {
          alert('로고 또는 포스터 생성 도중 오류가 발생했습니다.');
        }
        console.error('There was an error!', error);
      } else {
        alert('로고 또는 포스터 생성 도중 예기치 않은 오류가 발생했습니다.');
        console.error('There was an unexpected error!', error);
      }
    } finally {
      setIsLoading(false);
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
      }, 500); // Adjusted interval speed to 400ms for a smoother progress bar
    }
  }, [isLoading]);

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

  // If not loading, display the main content
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
              <div className="mt-56 flex w-full flex-row justify-between px-4">
                <Link to="/choosecolor">
                  <MoveButton buttonText="이전" />
                </Link>
                <button onClick={handleGenerateClick}>
                  <MoveButton buttonText="생성" />
                </button>
              </div>
            </div>
          </div>
        </Background>
      </div>
    </div>
  );
}

export default SelectStylePage;
