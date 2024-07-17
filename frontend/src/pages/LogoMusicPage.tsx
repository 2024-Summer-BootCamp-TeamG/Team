import React, { useState, useRef, useEffect } from 'react';
import Background from '../components/Background.tsx';
import NavBar from '../components/NavBar.tsx';
import Poster from "../assets/Poster.png";
import Taehologo from "../assets/TaehoLogo.png";

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
    <div className="relative flex w-screen h-screen flex-col items-center justify-center bg-black bg-cover">
      <div className="relative w-full h-full">
        <Background>
          <NavBar />
          <div className="flex flex-col justify-center items-center">
            <div className="relative top-32 flex flex-col justify-start items-start h-[46rem] w-[80rem] rounded-[2.5rem] border border-white bg-gradient-to-b from-white/20 to-slate-400/10 backdrop-blur-xl p-6">
              <div className="text-7xl text-white ml-3 mt-3">Complete!</div>
              <div className="text-4xl text-white ml-3 mt-2">로고와 CM송이 완성되었어요!</div>
              <div className="flex-grow flex items-center justify-center">
                <div className="relative w-72 h-72 cursor-pointer perspective-1000" onClick={toggleImage}>
                  <div className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${isFrontImage ? 'rotate-y-0' : 'rotate-y-180'}`}>
                    <img
                      src={Taehologo}
                      alt="Taeho Logo"
                      className={`absolute inset-0 w-full h-full object-cover backface-hidden ${isFrontImage ? 'opacity-100' : 'opacity-0'}`}
                    />
                    <img
                      src={Poster}
                      alt="Poster"
                      className={`absolute inset-0 w-full h-full object-cover backface-hidden ${isFrontImage ? 'opacity-0' : 'opacity-100 rotate-y-180'}`}
                    />
                  </div>
                </div>
              </div>
              <div className="mb-10 w-full flex flex-col items-center justify-end">
                <audio ref={audioRef} src="/audio3.mp3"></audio> {/* 오디오 파일 경로 변경 */}
                <div className="w-[5rem] flex items-center justify-between text-white">
                  <span>{formatTime(currentTime)}</span>
                  <button onClick={togglePlayPause} className="mx-4">
                    {isPlaying ? (
                      <svg className="w-10 h-10" fill="white" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
                      </svg>
                    ) : (
                      <svg className="w-10 h-10" fill="white" viewBox="0 0 24 24">
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
                  onChange={(e) => (audioRef.current.currentTime = e.target.value)}
                  className="w-[55rem] mt-2"
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




