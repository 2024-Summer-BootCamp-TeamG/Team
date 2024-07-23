import React, { useEffect, useState, useRef } from 'react';
import Background from '../components/Background';
import Album from '../assets/Album.png';
import '../pages/Index/style.css';

function DetailedInquiryPage() {
  const [showDetail, setShowDetail] = useState(false);
  const [audioUrl, setAudioUrl] = useState(''); // 제공된 오디오 URL로 설정
  const [posterUrl, setPosterUrl] = useState(''); // 초기 포스터 URL을 빈 문자열로 설정
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    async function fetchAudioUrl() {
      const response = await fetch(
        'http://localhost:8000/prompts/generate_music',
        {
          method: 'POST', // 메서드를 POST로 변경
          headers: {
            'Content-Type': 'application/json',
          },
          // 필요한 경우 요청 본문 추가
          body: JSON.stringify({
            // 요청 본문 데이터
          }),
        },
      );
      const data = await response.json();
      setAudioUrl(data.audio_url); // 응답에서 오디오 URL 설정
    }
    async function fetchPosterUrl() {
      const response = await fetch(
        'http://localhost:8000/prompts/generate_poster',
        {
          method: 'GET', // 메서드를 GET으로 변경
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const data = await response.json();
      setPosterUrl(data.poster_url); // 응답에서 포스터 URL 설정
    }

    fetchAudioUrl(); // 함수 호출
    fetchPosterUrl(); // 함수 호출

    const audio = audioRef.current;

    if (audio) {
      // audioRef.current의 존재 여부 확인
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
        audio.removeEventListener('ended', () =>
          setCurrentTime(audio.duration),
        );
      };
    }

    if (!showDetail) {
      const galleryContainer = document.querySelector(
        '.gallery-container',
      ) as HTMLElement;
      const galleryControlsContainer = document.querySelector(
        '.gallery-controls',
      ) as HTMLElement;
      const galleryControls = ['이전', '다음'];
      const galleryItems = document.querySelectorAll(
        '.gallery-item',
      ) as NodeListOf<HTMLElement>;

      class Carousel {
        private carouselContainer: HTMLElement;
        private carouselControls: string[];
        private carouselArray: HTMLElement[];
        private currentItem: number;

        constructor(
          container: HTMLElement,
          items: NodeListOf<HTMLElement>,
          controls: string[],
        ) {
          this.carouselContainer = container;
          this.carouselControls = controls;
          this.carouselArray = [...items];
          this.currentItem = 0;
        }

        private updateGallery(): void {
          this.carouselArray.forEach((el, i) => {
            el.style.order =
              ((i - this.currentItem + this.carouselArray.length) %
                this.carouselArray.length) +
              '';
            el.className = el.className.replace(
              /gallery-item-\d/,
              `gallery-item-${((i - this.currentItem + this.carouselArray.length) % this.carouselArray.length) + 1}`,
            );
          });
        }

        private setCurrentState(direction: HTMLElement): void {
          if (direction.className.includes('gallery-controls-previous')) {
            this.currentItem =
              (this.currentItem - 1 + this.carouselArray.length) %
              this.carouselArray.length;
          } else if (direction.className.includes('gallery-controls-next')) {
            this.currentItem =
              (this.currentItem + 1) % this.carouselArray.length;
          }
          this.updateGallery();
        }

        public setControls(): void {
          this.carouselControls.forEach((control) => {
            const button = document.createElement('button');
            button.className = `gallery-controls-${control === '이전' ? 'previous' : 'next'}`;
            button.innerText = control;
            galleryControlsContainer.appendChild(button);
          });
        }

        public useControls(): void {
          const triggers = [...galleryControlsContainer.children];
          triggers.forEach((control) => {
            control.addEventListener('click', (e) => {
              e.preventDefault();
              this.setCurrentState(control as HTMLElement);
            });
          });
        }
      }

      const exampleCarousel = new Carousel(
        galleryContainer,
        galleryItems,
        galleryControls,
      );

      exampleCarousel.setControls();
      exampleCarousel.useControls();
    }
  }, [showDetail]);

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

  return (
    <>
      <Background>
        {showDetail ? (
          <div className="absolute left-[10rem] top-8 flex h-[46rem] w-[64rem] flex-col items-center justify-center rounded-[2.5rem] border border-white bg-gradient-to-b from-white/20 to-slate-400/10 p-6 backdrop-blur-xl">
            <button
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                padding: '2rem',
              }}
              onClick={() => setShowDetail(false)}
            >
              X
            </button>
            <div className="font-['Cafe24 Danjunghae'] left-center absolute top-[6rem] h-[3.5rem] w-[20rem] text-[2rem] font-normal leading-[4rem] text-[#eec1fd]">
              로고,포스터,cm송
            </div>
            <img
              className="left-center h-[20rem] w-[20rem] rounded-[3.5rem]"
              src="https://teammg.s3.ap-northeast-2.amazonaws.com/bcc5ff5c-5324-42f1-b82d-f8ee14bc3fec" // 제공된 포스터 URL로 설정
              //src={posterUrl} // 상태 변수에서 포스터 URL 가져오기 나중에 위와 주석 위치 수정
            />

            <audio ref={audioRef} src={audioUrl} className="mt-4">
              Your browser does not support the audio element.
            </audio>
            <div className="mt-4 flex w-[55rem] items-center justify-between text-white">
              <span>{formatTime(currentTime)}</span>
              <button onClick={togglePlayPause} className="mx-4">
                {isPlaying ? (
                  <svg className="h-10 w-10" fill="white" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
                  </svg>
                ) : (
                  <svg className="h-10 w-10" fill="white" viewBox="0 0 24 24">
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
              className="mt-2 w-[55rem]"
            />
          </div>
        ) : (
          <div className="gallery">
            <div className="gallery-container">
              <img
                className="gallery-item gallery-item-1"
                src={Album}
                alt="gallery image"
                data-index="1"
                onClick={() => setShowDetail(true)}
              />
              <img
                className="gallery-item gallery-item-2"
                src={Album}
                alt="gallery image"
                data-index="2"
                onClick={() => setShowDetail(true)}
              />
              <img
                className="gallery-item gallery-item-3"
                src={Album}
                alt="gallery image"
                data-index="3"
                onClick={() => setShowDetail(true)}
              />
              <img
                className="gallery-item gallery-item-4"
                src={Album}
                alt="gallery image"
                data-index="4"
                onClick={() => setShowDetail(true)}
              />
              <img
                className="gallery-item gallery-item-5"
                src={Album}
                alt="gallery image"
                data-index="5"
                onClick={() => setShowDetail(true)}
              />
            </div>
            <div className="gallery-controls"></div>
          </div>
        )}
      </Background>
    </>
  );
}

export default DetailedInquiryPage;
