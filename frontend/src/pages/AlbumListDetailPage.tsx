import { useEffect, useState, useRef } from 'react';
import axiosInstance from '../api/axios';
import '../pages/Index/style.css';

import Background from '../components/Background';
import NavBar from '../components/NavBar';

import Album from '../assets/AlbumCD.png';
import CloseIcon from '../assets/CloseIcon.svg';

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
  const [promotions, setPromotions] = useState<PromotionData[]>([]);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');

    console.log(userId);
    if (!userId) {
      console.error('User ID not found in localStorage');
      return;
    }
    const fetchList = async () => {
      const endpoint = `${axiosInstance}/promotions/`;

      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data: PromotionData[] = await response.json();
          console.log('Promotions:', data); // API 응답 로그

          setPromotions(data);
        } else {
          console.error('Failed to fetch data:', response.status);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchList();
  }, []);

  useEffect(() => {
    const fetchDetail = async () => {
      if (selectedItem === null) return;

      const endpoint = `${axiosInstance}/promotions/${selectedItem}`;

      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data: PromotionData = await response.json();
          console.log('Selected Promotion:', data); // 상세 정보 로그
          setPosterUrl(data.poster_url || '');
          setAudioUrl(data.audio_url || '');
          setLogoUrl(data.logo_url || '');
        } else {
          console.error('Failed to fetch data:', response.status);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (showDetail) {
      fetchDetail();
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
      if (galleryContainer && galleryControlsContainer) {
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
            const triggers = Array.from(
              galleryControlsContainer?.children || [],
            );
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
            {selectedItem === 9 && (
              <div className="font-['Cafe24 Danjunghae'] absolute top-[4rem] flex h-[3.5rem] w-[20rem] justify-center text-[2rem] font-normal leading-[4rem] text-[#eec1fd]">
                0726
              </div>
            )}
            {selectedItem === 10 && (
              <div className="font-['Cafe24 Danjunghae'] absolute left-[25rem] top-[4rem] h-[3.5rem] w-[20rem] text-[2rem] font-normal leading-[4rem] text-[#eec1fd]">
                내용 2
              </div>
            )}
            {selectedItem === 11 && (
              <div className="font-['Cafe24 Danjunghae'] absolute left-[25rem] top-[4rem] h-[3.5rem] w-[20rem] text-[2rem] font-normal leading-[4rem] text-[#eec1fd]">
                내용 3
              </div>
            )}
            {selectedItem === 12 && (
              <div className="font-['Cafe24 Danjunghae'] absolute left-[25rem] top-[4rem] h-[3.5rem] w-[20rem] text-[2rem] font-normal leading-[4rem] text-[#eec1fd]">
                내용 4
              </div>
            )}
            {selectedItem === 13 && (
              <div className="font-['Cafe24 Danjunghae'] absolute left-[25rem] top-[4rem] h-[3.5rem] w-[20rem] text-[2rem] font-normal leading-[4rem] text-[#eec1fd]">
                내용 5
              </div>
            )}

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
                      src={logoUrl}
                      alt="Generated Logo"
                      className={`backface-hidden absolute inset-0 h-full w-full object-cover ${
                        isFrontImage ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                    <img
                      src={posterUrl}
                      alt="Generated Poster"
                      className={`backface-hidden absolute inset-0 h-full w-full object-cover ${
                        isFrontImage ? 'opacity-0' : 'rotate-y-180 opacity-100'
                      }`}
                    />
                  </div>
                </div>
              </div>
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
              {promotions.map((promotion, index) => (
                <img
                  key={index}
                  className={`gallery-item gallery-item-${index + 1}`}
                  src={promotion.logo_url}
                  alt={`gallery image ${index + 1}`}
                  data-index={index}
                  onClick={() => {
                    setSelectedItem(index + 1);
                    setShowDetail(true);
                  }}
                />
              ))}
            </div>

            <div className="gallery-controls"></div>
          </div>
        )}
      </Background>
    </>
  );
}

export default DetailedInquiryPage;
