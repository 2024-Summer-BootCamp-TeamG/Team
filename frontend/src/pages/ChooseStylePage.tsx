import { useState } from 'react';
import Background from '../components/Background';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { SelectStyleState } from '../recoil/SelectStyleAtom';
import { businessInputState } from '../recoil/BusinessInputAtom';
import { ChooseColorState } from '../recoil/ChooseColorAtom';
import NavBar from '../components/NavBar';
import Vector from '../components/Vector.png';
import axios from 'axios';
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
      const response = await axios.post(
        'http://localhost:8000/prompts/generate_logo/',
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

  return (
    <Background>
      <NavBar />
      <div className="relative flex h-[40rem] w-[90rem] flex-col items-center rounded-[40px] border-2 border-white shadow">
        <div className="mt-8 text-3xl text-white">
          글꼴과 아이콘의 스타일을 선택해주세요!
        </div>
        <div className="mt-28 flex flex-col items-center justify-center gap-16">
          <div className="relative h-[0rem] w-[70rem] border-2 border-white">
            <div className="absolute left-1/2 top-6 flex -translate-x-1/2 transform flex-col items-center">
              <button
                className={`style-button ${selectedStyle === '모던한' ? 'selected' : ''}`}
                onClick={() => handleStyleClick('모던한')}
              >
                <img src={Vector} alt="Vector Icon" className="style-icon" />
              </button>
              <div className="mt-2 text-center text-white">모던한</div>
            </div>
            <div className="absolute -top-10 left-96 flex -translate-x-1/2 transform flex-col items-center">
              <button
                className={`style-button ${selectedStyle === '공식적인' ? 'selected' : ''}`}
                onClick={() => handleStyleClick('공식적인')}
              >
                <img src={Vector} alt="Vector Icon" className="style-icon" />
              </button>
              <div className="mt-2 text-center text-white">공식적인</div>
            </div>
          </div>
          <div className="relative h-[0rem] w-[70rem] border-2 border-white">
            <div className="absolute right-80 top-5 flex -translate-x-1/2 transform flex-col items-center">
              <button
                className={`style-button ${selectedStyle === '귀여운' ? 'selected' : ''}`}
                onClick={() => handleStyleClick('귀여운')}
              >
                <img src={Vector} alt="Vector Icon" className="style-icon" />
              </button>
              <div className="mt-2 text-center text-white">귀여운</div>
            </div>
            <div className="absolute -top-12 left-64 flex -translate-x-1/2 transform flex-col items-center">
              <button
                className={`style-button ${selectedStyle === '고급진' ? 'selected' : ''}`}
                onClick={() => handleStyleClick('고급진')}
              >
                <img src={Vector} alt="Vector Icon" className="style-icon" />
              </button>
              <div className="mt-2 text-center text-white">고급진</div>
            </div>
          </div>
          <div className="relative h-[0rem] w-[70rem] border-2 border-white">
            <div className="absolute -top-28 right-48 flex -translate-x-1/2 transform flex-col items-center">
              <button
                className={`style-button ${selectedStyle === '창의적인' ? 'selected' : ''}`}
                onClick={() => handleStyleClick('창의적인')}
              >
                <img src={Vector} alt="Vector Icon" className="style-icon" />
              </button>
              <div className="mt-2 text-center text-white">창의적인</div>
            </div>
            <div className="absolute -top-12 left-36 flex -translate-x-1/2 transform flex-col items-center">
              <button
                className={`style-button ${selectedStyle === '재미난' ? 'selected' : ''}`}
                onClick={() => handleStyleClick('재미난')}
              >
                <img src={Vector} alt="Vector Icon" className="style-icon" />
              </button>
              <div className="mt-2 text-center text-white">재미난</div>
            </div>
          </div>
          <div className="relative h-[0rem] w-[70rem] border-2 border-white">
            <div className="absolute -top-64 right-20 flex -translate-x-1/2 transform flex-col items-center">
              <button
                className={`style-button ${selectedStyle === '간단한' ? 'selected' : ''}`}
                onClick={() => handleStyleClick('간단한')}
              >
                <img src={Vector} alt="Vector Icon" className="style-icon" />
              </button>
              <div className="mt-2 text-center text-white">간단한</div>
            </div>
            <div className="absolute -top-12 left-3 flex -translate-x-1/2 transform flex-col items-center">
              <button
                className={`style-button ${selectedStyle === '장난스러운' ? 'selected' : ''}`}
                onClick={() => handleStyleClick('장난스러운')}
              >
                <img src={Vector} alt="Vector Icon" className="style-icon" />
              </button>
              <div className="mt-2 text-center text-white">장난스러운</div>
            </div>
          </div>
          <div className="relative h-[0rem] w-[70rem] border-2 border-white">
            <div className="absolute -right-10 -top-64 flex -translate-x-1/2 transform flex-col items-center">
              <button
                className={`style-button ${selectedStyle === '다이나믹한' ? 'selected' : ''}`}
                onClick={() => handleStyleClick('다이나믹한')}
              >
                <img src={Vector} alt="Vector Icon" className="style-icon" />
              </button>
              <div className="mt-2 text-center text-white">다이나믹한</div>
            </div>
          </div>
          <div className="mt-56 flex w-full flex-row justify-between px-4">
            <button onClick={() => navigate('/choosecolor')}>
              <div className="text-white">이전</div>
            </button>
            <button onClick={handleGenerateClick} disabled={isLoading}>
              <div className="text-white">
                {isLoading ? '생성 중...' : '다음'}
              </div>
            </button>
          </div>
        </div>
      </div>
    </Background>
  );
}

export default ChooseStyle;
