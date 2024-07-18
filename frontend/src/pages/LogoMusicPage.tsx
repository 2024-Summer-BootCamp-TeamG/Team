import React, { useState, useRef, useEffect } from 'react';
import Background from '../components/Background.tsx';
import NavBar from '../components/NavBar.tsx';
import Poster from '../assets/Poster.png';
import Taehologo from '../assets/TaehoLogo.png';

function LogoMusicPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFrontImage, setIsFrontImage] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;

    const setAudioData = () => {
      setDuration(audio.duration || 0);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
      // 음악이 끝날 때 재생 바가 끝까지 가도록 보정
      if (audio.currentTime >= audio.duration - 0.1) {
        setCurrentTime(audio.duration);
        setIsPlaying(false);
      }
    };

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', () => setCurrentTime(audio.duration));

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', () => setCurrentTime(audio.duration));
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const toggleImage = () => {
    setIsFrontImage(!isFrontImage);
  };

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-black bg-cover">
      <div className="relative h-full w-full">
        <Background>
          <NavBar />
          <div className="flex h-full flex-col items-center justify-center">
            <div className="relative top-32 flex h-[46rem] w-[80rem] flex-col items-center justify-center rounded-[2.5rem] border border-white bg-gradient-to-b from-white/20 to-slate-400/10 p-6 backdrop-blur-xl">
              <div className="ml-3 mt-3 text-7xl text-white">Complete!</div>
              <div className="ml-3 mt-2 text-4xl text-white">
                로고와 CM송이 완성되었어요!
              </div>
              <div className="flex flex-grow items-center justify-center">
                <div
                  className="perspective-1000 relative h-72 w-72 cursor-pointer"
                  onClick={toggleImage}
                >
                  <div
                    className={`transform-style-preserve-3d relative h-full w-full transition-transform duration-700 ${isFrontImage ? 'rotate-y-0' : 'rotate-y-180'}`}
                  >
                    <img
                      src={Taehologo}
                      alt="Taeho Logo"
                      className={`backface-hidden absolute inset-0 h-full w-full object-cover ${isFrontImage ? 'opacity-100' : 'opacity-0'}`}
                    />
                    <img
                      src={Poster}
                      alt="Poster"
                      className={`backface-hidden absolute inset-0 h-full w-full object-cover ${isFrontImage ? 'opacity-0' : 'rotate-y-180 opacity-100'}`}
                    />
                  </div>
                </div>
              </div>
              <div className="mb-10 flex w-full flex-col items-center justify-end">
                <audio ref={audioRef} src="/audio3.mp3"></audio>{' '}
                {/* 오디오 파일 경로 변경 */}
                <div className="flex w-[55rem] items-center justify-between text-white">
                  <span>{formatTime(currentTime)}</span>
                  <button onClick={togglePlayPause} className="mx-4">
                    {isPlaying ? (
                      <svg
                        className="h-10 w-10"
                        fill="white"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
                      </svg>
                    ) : (
                      <svg
                        className="h-10 w-10"
                        fill="white"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>
                  <span>{formatTime(duration)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={(e) =>
                    (audioRef.current.currentTime = e.target.value)
                  }
                  className="mt-2 w-[55rem]"
                />
              </div>
            </div>
          </div>
        </Background>
      </div>
    </div>
  );
}

export default LogoMusicPage;
