import { useEffect, useState, useRef } from 'react';
import Background from '../components/Background';

// import Logo from '../assets/8Logo.png';
// import Poster from '../assets/8Poster.png';
import Music from '../../public/10.mp3';
import Album from '../assets/AlbumCD.png';
import NavBar from '../components/NavBar';
import '../pages/Index/style.css';
import CloseIcon from '../assets/CloseIcon.svg';
import testLogo1 from '../assets/testLogo/8Logo.png';
import testLogo2 from '../assets/testLogo/testLogo2.png';
import testLogo3 from '../assets/testLogo/testLogo3.jpeg';
import testLogo4 from '../assets/testLogo/testLogo4.jpeg';
import testLogo5 from '../assets/testLogo/testLogo5.png';
import { useRecoilValue } from 'recoil';
import {
  generatedLogoState,
  generatedPosterState,
  // generatedMusicState,
} from '../recoil/GeneratedAtom';
interface PromotionData {
  poster_url: string;
  audio_url: string;
  logo_url: string;
}

function DetailedInquiryPage() {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [posterUrl, setPosterUrl] = useState<string>('');
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isFrontImage, setIsFrontImage] = useState<boolean>(true);
  const generatedLogo = useRecoilValue(generatedLogoState);
  const generatedPoster = useRecoilValue(generatedPosterState);
  useEffect(() => {
    const fetchData = async () => {
      if (selectedItem === null) return;

      const user_id = localStorage.getItem('user_id') || undefined; // null일 경우 undefined로 변환
      console.log(user_id);

      const endpoint = 'http://brandifyy.site/api/prompts/analysis_text';

      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            user_id: user_id as string, // user_id를 헤더에 포함
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data: PromotionData = await response.json();
          setPosterUrl(data.poster_url);
          setAudioUrl(data.audio_url);
          setLogoUrl(data.logo_url);
        } else {
          console.error('Failed to fetch data:', response.status);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (showDetail) {
      fetchData();
    }

    const audio = audioRef.current;

    if (audio) {
      const setAudioData = () => {
        setDuration(audio.duration || 0);
        setCurrentTime(audio.currentTime);
      };

      const setAudioTime = () => {
        setCurrentTime(audio.currentTime);
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
  }, [showDetail, selectedItem]);

  useEffect(() => {
    if (!showDetail) {
      const galleryContainer = document.querySelector('.gallery-container');
      const galleryControlsContainer =
        document.querySelector('.gallery-controls');
      const galleryControls = ['이전', '다음'];
      const galleryItems = document.querySelectorAll('.gallery-item');
      class Carousel {
        carouselContainer: Element;
        carouselControls: string[];
        carouselArray: HTMLElement[];
        currentItem: number;

        constructor(
          container: Element,
          items: NodeListOf<Element>,
          controls: string[],
        ) {
          this.carouselContainer = container;
          this.carouselControls = controls;
          this.carouselArray = Array.from(items) as HTMLElement[];
          this.currentItem = 0;
        }

        updateGallery() {
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

        setCurrentState(direction: Element) {
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

        setControls() {
          this.carouselControls.forEach((control) => {
            const button = document.createElement('button');
            button.className = `gallery-controls-${control === '이전' ? 'previous' : 'next'}`;
            button.innerText = control;
            galleryControlsContainer?.appendChild(button);
          });
        }

        useControls() {
          const triggers = Array.from(galleryControlsContainer?.children || []);
          triggers.forEach((control) => {
            control.addEventListener('click', (e) => {
              e.preventDefault();
              this.setCurrentState(control);
            });
          });
        }
      }

      if (galleryContainer && galleryItems.length > 0) {
        const exampleCarousel = new Carousel(
          galleryContainer,
          galleryItems,
          galleryControls,
        );
        exampleCarousel.setControls();
        exampleCarousel.useControls();
      }
    }
  }, [showDetail, selectedItem]);

  const togglePlayPause = async () => {
    const audio = audioRef.current;

    if (audio) {
      try {
        if (isPlaying) {
          await audio.pause();
        } else {
          if (audio.readyState >= 2) {
            await audio.play();
          } else {
            audio.addEventListener(
              'canplaythrough',
              async () => {
                try {
                  await audio.play();
                } catch (error) {
                  console.error('Error during play:', error);
                }
              },
              { once: true },
            );
          }
        }
        setIsPlaying((prev) => !prev);
      } catch (error) {
        console.error('Audio error:', error);
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const toggleImage = () => {
    setIsFrontImage(!isFrontImage);
  };

  return (
    <>
      <Background>
        <NavBar />
        {showDetail ? (
          <div className="left-center absolute top-8 flex h-[46rem] w-[64rem] flex-col items-center justify-center rounded-[2.5rem] border border-white bg-gradient-to-b from-white/20 to-slate-400/10 p-6 backdrop-blur-xl">
            <button
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                padding: '2rem',
              }}
              onClick={() => setShowDetail(false)}
            >
              <img
                src={CloseIcon}
                style={{ width: '2rem', height: '2rem' }}
                alt="닫기"
              />
            </button>
            {selectedItem === 1 && (
              <div className="font-['Cafe24 Danjunghae'] absolute top-[4rem] flex h-[3.5rem] w-[20rem] justify-center text-[2rem] font-normal leading-[4rem] text-[#eec1fd]">
                0726
              </div>
            )}
            {selectedItem === 2 && (
              <div className="font-['Cafe24 Danjunghae'] absolute left-[25rem] top-[4rem] h-[3.5rem] w-[20rem] text-[2rem] font-normal leading-[4rem] text-[#eec1fd]">
                내용 2
              </div>
            )}
            {selectedItem === 3 && (
              <div className="font-['Cafe24 Danjunghae'] absolute left-[25rem] top-[4rem] h-[3.5rem] w-[20rem] text-[2rem] font-normal leading-[4rem] text-[#eec1fd]">
                내용 3
              </div>
            )}
            {selectedItem === 4 && (
              <div className="font-['Cafe24 Danjunghae'] absolute left-[25rem] top-[4rem] h-[3.5rem] w-[20rem] text-[2rem] font-normal leading-[4rem] text-[#eec1fd]">
                내용 4
              </div>
            )}
            {selectedItem === 5 && (
              <div className="font-['Cafe24 Danjunghae'] absolute left-[25rem] top-[4rem] h-[3.5rem] w-[20rem] text-[2rem] font-normal leading-[4rem] text-[#eec1fd]">
                내용 5
              </div>
            )}
            연동
            <img
              className="relative left-[11.5rem] h-[20rem] w-[20rem] rounded-[3.5rem]"
              src={posterUrl}
            />
            <img
              className="absolute left-[11.5rem] top-[10.5rem] h-[20rem] w-[20rem] rounded-[3.5rem]"
              src={logoUrl}
              alt="Logo"
            />
            <div>
              <div className="flex flex-grow items-center justify-center">
                <div className="flex items-center justify-center">
                  <img
                    src={Album}
                    alt="Album"
                    className={`absolute h-60 w-60 object-cover ${
                      isPlaying ? 'slow-spin' : ''
                    }`}
                  />
                </div>
                <div
                  className="perspective-1000 relative h-60 w-60 cursor-pointer"
                  onClick={toggleImage}
                >
                  <div
                    className={`transform-style-preserve-3d relative h-60 w-60 transition-transform duration-700 ${
                      isFrontImage ? 'rotate-y-0' : 'rotate-y-180'
                    }`}
                  >
                    <img
                      src={generatedLogo}
                      alt="Generated Logo"
                      className={`backface-hidden absolute inset-0 h-full w-full object-cover ${
                        isFrontImage ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                    <img
                      src={generatedPoster}
                      alt="Generated Poster"
                      className={`backface-hidden absolute inset-0 h-full w-full object-cover ${
                        isFrontImage ? 'opacity-0' : 'rotate-y-180 opacity-100'
                      }`}
                    />
                  </div>
                </div>
              </div>
              <audio ref={audioRef} src={Music} className="mt-4">
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
            </div>
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={(e) => {
                const newTime = parseFloat(e.target.value);
                if (audioRef.current) {
                  audioRef.current.currentTime = newTime;
                  setCurrentTime(newTime);
                }
              }}
              className="mt-2 w-[55rem]"
            />
          </div>
        ) : (
          <div className="gallery">
            <div className="gallery-container">
              <img
                className="gallery-item gallery-item-1"
                src={testLogo3}
                alt="gallery image"
                data-index="3"
                onClick={() => {
                  setSelectedItem(3);
                  setShowDetail(true);
                }}
              />
              <img
                className="gallery-item gallery-item-2"
                src={testLogo2}
                alt="gallery image"
                data-index="2"
                onClick={() => {
                  setSelectedItem(2);
                  setShowDetail(true);
                }}
              />
              <img
                className="gallery-item gallery-item-3"
                src={testLogo1}
                alt="gallery image"
                data-index="1"
                onClick={() => {
                  setSelectedItem(1);
                  setShowDetail(true);
                }}
              />
              <img
                className="gallery-item gallery-item-4"
                src={testLogo4}
                alt="gallery image"
                data-index="4"
                onClick={() => {
                  setSelectedItem(4);
                  setShowDetail(true);
                }}
              />
              <img
                className="gallery-item gallery-item-5"
                src={testLogo5}
                alt="gallery image"
                data-index="5"
                onClick={() => {
                  setSelectedItem(5);
                  setShowDetail(true);
                }}
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
