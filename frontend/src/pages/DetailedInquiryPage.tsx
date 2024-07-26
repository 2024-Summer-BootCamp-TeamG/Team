import React, { useEffect, useState, useRef } from 'react';
import Background from '../components/Background';
import Album from '../assets/Album.png';
import Album1 from '../assets/Album1.png';
import Album2 from '../assets/Album2.png';
import Album4 from '../assets/Album4.png';
import Album5 from '../assets/Album5.png';

import '../pages/Index/style.css';

function DetailedInquiryPage() {
  const [showDetail, setShowDetail] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isFrontImage, setIsFrontImage] = useState(true); // 이미지 전환 상태 추가
  const audioRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      let endpoint = '';
      switch (selectedItem) {
        case 1:
          endpoint = 'http://localhost:8000/promotions/21';
          break;
        case 2:
          endpoint = 'http://localhost:8000/promotions/33';
          break;
        case 3:
          endpoint = 'http://localhost:8000/promotions/38';
          break;
        case 4:
          endpoint = 'http://localhost:8000/promotions/38';
          break;
        case 5:
          endpoint = 'http://localhost:8000/promotions/39';
          break;
        default:
          return;
      }

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setPosterUrl(data.poster_url);
        setAudioUrl(data.audio_url);
        setLogoUrl(data.logo_url);
      } else {
        console.error('Failed to fetch data:', response.status);
      }
    }

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

    if (!showDetail) {
      const galleryContainer = document.querySelector('.gallery-container');
      const galleryControlsContainer =
        document.querySelector('.gallery-controls');
      const galleryControls = ['이전', '다음'];
      const galleryItems = document.querySelectorAll('.gallery-item');

      class Carousel {
        constructor(container, items, controls) {
          this.carouselContainer = container;
          this.carouselControls = controls;
          this.carouselArray = [...items];
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

        setCurrentState(direction) {
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
            galleryControlsContainer.appendChild(button);
          });
        }

        useControls() {
          const triggers = [...galleryControlsContainer.children];
          triggers.forEach((control) => {
            control.addEventListener('click', (e) => {
              e.preventDefault();
              this.setCurrentState(control);
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

  const formatTime = (time) => {
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
              X
            </button>
            {selectedItem === 1 && (
              <div className="font-['Cafe24 Danjunghae'] absolute left-[25rem] top-[4rem] h-[3.5rem] w-[20rem] text-[2rem] font-normal leading-[4rem] text-[#eec1fd]">
                내용 1
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
            <div
              className="perspective-1000 relative h-80 w-80 cursor-pointer"
              onClick={toggleImage}
            >
              <div
                className={`transform-style-preserve-3d relative h-full w-full transition-transform duration-700 ${isFrontImage ? 'rotate-y-0' : 'rotate-y-180'}`}
              >
                <img
                  src={logoUrl}
                  alt="Logo"
                  className={`backface-hidden absolute inset-0 h-full w-full object-cover ${isFrontImage ? 'opacity-100' : 'opacity-0'}`}
                />
                <img
                  src={posterUrl}
                  alt="Poster"
                  className={`backface-hidden absolute inset-0 h-full w-full object-cover ${isFrontImage ? 'opacity-0' : 'rotate-y-180 opacity-100'}`}
                />
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
                src={Album1}
                alt="gallery image"
                data-index="1"
                onClick={() => {
                  setSelectedItem(1);
                  setShowDetail(true);
                }}
              />
              <img
                className="gallery-item gallery-item-2"
                src={Album2}
                alt="gallery image"
                data-index="2"
                onClick={() => {
                  setSelectedItem(2);
                  setShowDetail(true);
                }}
              />
              <img
                className="gallery-item gallery-item-3"
                src={Album}
                alt="gallery image"
                data-index="3"
                onClick={() => {
                  setSelectedItem(3);
                  setShowDetail(true);
                }}
              />
              <img
                className="gallery-item gallery-item-4"
                src={Album4}
                alt="gallery image"
                data-index="4"
                onClick={() => {
                  setSelectedItem(4);
                  setShowDetail(true);
                }}
              />
              <img
                className="gallery-item gallery-item-5"
                src={Album5}
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
