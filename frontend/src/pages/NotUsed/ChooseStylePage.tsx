import { useState } from 'react';
import axios from 'axios';
import axiosInstance from '../../api/axios';

import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import Background from '../../components/Background';

import { SelectStyleState } from '../../recoil/SelectStyleAtom';
import { businessInputState } from '../../recoil/BusinessInputAtom';
import { ChooseColorState } from '../../recoil/ChooseColorAtom';

import Vector from '../../assets/Vectornote.svg';
import VectorClicked from '../../assets/noteClicked.svg';
import rightArrow from '../../assets/rightArrow.svg';
import leftArrow from '../../assets/leftArrow.svg';

import './ChooseStyle.css'; // CSS 파일 임포트

function ChooseStyle() {
  const [selectedStyle, setSelectedStyle] = useRecoilState(SelectStyleState);
  const [color] = useRecoilState(ChooseColorState);
  const [logoText] = useRecoilState(businessInputState);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleStyleClick = (style: any) => {
    setSelectedStyle(style);
    console.log('버튼 선택됨:', style);
  };

  const handleGenerateClick = async () => {
    if (isLoading) return; // 이미 요청 중이면 무시

    setIsLoading(true); // 요청 시작
    try {
      const response = await axiosInstance.post(
        '/prompts/generate_logo/',
        {
          style: selectedStyle,
          color: color,
          logo_text: logoText,
        },
        {
          withCredentials: true,
        },
      );

      console.log('API 응답:', response.data);
      if (response.status === 201) {
        alert('로고가 성공적으로 생성되었습니다.');
        navigate('/logomusic');
      } else {
        alert('로고 생성에 실패했습니다.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorMessage =
            error.response.data.detail || JSON.stringify(error.response.data);
          alert(`로고 생성 도중 오류가 발생했습니다: ${errorMessage}`);
        } else {
          alert('로고 생성 도중 오류가 발생했습니다.');
        }
        console.error('오류 발생!', error);
      } else {
        alert('로고 생성 도중 예기치 않은 오류가 발생했습니다.');
        console.error('예기치 않은 오류 발생!', error);
      }
    } finally {
      setIsLoading(false); // 요청 완료
    }
  };
  const getIcon = (style: string) => {
    return selectedStyle === style ? VectorClicked : Vector;
  };
  return (
    <Background>
      <NavBar />
      <div className="relative flex h-[30rem] w-[80rem] flex-col items-center rounded-[40px] border-2 border-white shadow">
        <div className="mt-8 text-3xl text-white">
          글꼴과 아이콘의 스타일을 선택해주세요!
        </div>
        <div className="mt-28 flex flex-col items-center justify-center gap-16">
          <div className="button-container">
            <div className="z-1 border-1 relative h-[0rem] w-[70rem] border-white">
              <div className="z-2 absolute left-1/2 top-6 flex -translate-x-1/2 transform flex-col items-center">
                <button
                  className={`style-button ${selectedStyle === '모던한' ? 'selected' : ''}`}
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
                  className={`style-button ${selectedStyle === '공식적인' ? 'selected' : ''}`}
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
            <div className="relative h-[0rem] w-[70rem] border-2 border-white">
              <div className="absolute right-80 top-5 flex -translate-x-1/2 transform flex-col items-center">
                <button
                  className={`style-button ${selectedStyle === '귀여운' ? 'selected' : ''}`}
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
                  className={`style-button ${selectedStyle === '고급진' ? 'selected' : ''}`}
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
          <div className="relative h-[0rem] w-[70rem] border-2 border-white">
            <div className="absolute -top-28 right-48 flex -translate-x-1/2 transform flex-col items-center">
              <button
                className={`style-button ${selectedStyle === '창의적인' ? 'selected' : ''}`}
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
                className={`style-button ${selectedStyle === '재미난' ? 'selected' : ''}`}
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
          <div className="relative h-[0rem] w-[70rem] border-2 border-white">
            <div className="absolute -top-64 right-20 flex -translate-x-1/2 transform flex-col items-center">
              <button
                className={`style-button ${selectedStyle === '간단한' ? 'selected' : ''}`}
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
                className={`style-button ${selectedStyle === '장난스러운' ? 'selected' : ''}`}
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
          <div className="relative h-[0rem] w-[70rem] border-2 border-white">
            <div className="absolute -right-10 -top-64 flex -translate-x-1/2 transform flex-col items-center justify-center">
              <button
                className={`style-button ${selectedStyle === '다이나믹한' ? 'selected' : ''}`}
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
          <div className="mt-24 flex w-full flex-row justify-between px-4">
            <button
              className="font-['Cafe24 Danjunghae'] flex h-[5rem] w-[12.5rem] justify-center text-center text-3xl font-normal text-white hover:text-bermuda"
              onClick={() => navigate('/choosecolor')}
            >
              <div className="text-white">
                {' '}
                이전
                <img
                  className="h-[2.5rem] w-[2.5rem]"
                  src={leftArrow}
                  alt="이전"
                />
              </div>
            </button>
            <button
              className="font-['Cafe24 Danjunghae'] flex h-[5rem] w-[12.5rem] justify-center text-center text-3xl font-normal text-white hover:text-bermuda"
              onClick={handleGenerateClick}
              disabled={isLoading}
            >
              <div className="text-white">
                {isLoading ? '생성 중...' : '다음'}

                <img
                  className="h-[2.5rem] w-[2.5rem]"
                  src={rightArrow}
                  alt="다음"
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </Background>
  );
}

export default ChooseStyle;
