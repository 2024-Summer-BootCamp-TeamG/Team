import React from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import Background from '../components/Background';
import NavBar from '../components/NavBar';
import StyleButton from '../components/StyleButton';
import MoveButton from '../components/MoveButton';
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
  const setGeneratedMusic = useSetRecoilState(generatedMusicState);

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  // 특정 버튼의 선택 상태 토글 함수
  const toggleButton = (buttonText: any) => {
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
      const logoResponse = await axios.post(
        'http://localhost:8000/prompts/generate_logo/',
        {
          style: selectedButton,
          color: color,
          logo_text: logoText,
        },
        {
          withCredentials: true,
        },
      );

      const posterResponse = await axios.post(
        'http://localhost:8000/prompts/generate_poster/',
        {
          style: selectedButton,
          color: color,
          poster_user_text: posterText,
        },
        {
          withCredentials: true,
        },
      );

      const musicResponse = await axios.post(
        'http://localhost:8000/prompts/generate_music/',
        {
          style: selectedButton,
          color: color,
          logo_text: logoText,
        },
        {
          withCredentials: true,
        },
      );
      console.log('Logo API Response:', logoResponse.data);
      console.log('Poster API Response:', posterResponse.data);
      console.log('Poster API Response:', musicResponse.data);

      if (
        logoResponse.status === 201 &&
        posterResponse.status === 201 &&
        musicResponse.status === 201
      ) {
        setGeneratedLogo(logoResponse.data.logo_url);
        setGeneratedPoster(posterResponse.data.poster_url);
        setGeneratedMusic(musicResponse.data.logo_url);

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
      setIsLoading(false); // 요청 완료
    }
  };

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-[#000000] bg-cover">
      <div className="relative h-full w-full">
        <Background>
          <NavBar />
          <div className="mb-12 mt-32 flex items-center justify-center text-center text-3xl text-white">
            원하는 색상을 선택해주세요!
          </div>
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
              {/* <div className="mt-56 flex w-full flex-row justify-between px-4">
                <Link to="/choosecolor">
                  <MoveButton buttonText="이전" />
                </Link>
                <button onClick={handleGenerateClick}>
                  <MoveButton buttonText="생성" />
                </button>
              </div> */}
              <div className="mt-2 mt-8 flex w-full justify-between px-4">
                <Link to="/busin">
                  <button
                    type="button"
                    className="font-['Cafe24 Danjunghae'] hover:text-bermuda flex h-[5rem] w-[12.5rem] justify-center text-center text-3xl font-normal text-white"
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
                    className="hover:text-bermuda font-['Cafe24 Danjunghae'] flex h-[5rem] w-[12.5rem] justify-center text-center text-3xl font-normal text-white"
                  >
                    다음
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
