import { useState, useEffect, ReactNode } from 'react';
import FullNote1 from '../assets/MusicNote/FullNote1.svg';
import FullNote2 from '../assets/MusicNote/FullNote2.svg';
import FullNote3 from '../assets/MusicNote/FullNote3.svg';
import FullNote4 from '../assets/MusicNote/FullNote4.svg';
import FullNote5 from '../assets/MusicNote/FullNote5.svg';
import FullNote6 from '../assets/MusicNote/FullNote6.svg';
import FullNote7 from '../assets/MusicNote/FullNote7.svg';
import './MainPage.scss';

interface MainPageProps {
  children: ReactNode;
}

interface Coordinate {
  src: string;
  left?: string;
  right?: string;
  top: string;
}

export default function MainPage({ children }: MainPageProps) {
  const [offsetY, setOffsetY] = useState(0);
  const handleScroll = () => setOffsetY(window.pageYOffset);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const notes: Coordinate[] = [
    { src: FullNote1, right: '90%', top: '70%' },
    { src: FullNote2, left: '10%', top: '80%' },
    { src: FullNote3, left: '90%', top: '70%' },
    { src: FullNote4, left: '25%', top: '90%' },
    { src: FullNote5, left: '80%', top: '15%' },
    { src: FullNote6, left: '10%', top: '30%' },
    { src: FullNote7, left: '2%', top: '40%' },
  ];

  return (
    <div className="MainPage">
      <div
        className="MainPage__background"
        style={{ transform: `translateY(-${offsetY * 0.5}px)` }}
      />
      <div
        className="MainPage__background-notes"
        style={{ transform: `translateY(${offsetY * 0.8}px)` }}
      >
        {notes.map((note, index) => (
          <img
            key={index}
            src={note.src}
            alt="음표"
            className="MainPage__note"
            style={{
              left: note.left,
              right: note.right,
              top: note.top,
            }}
          />
        ))}
      </div>
      <div className="MainPage__content">
        <div className="MainPage__content__text">
          <div className="MainPage__title">
            HOW ARE YOU <br /> FEELING TODAY?
          </div>
          <div className="MainPage__subtitle">
            오늘 당신의 기분과 음악을 알려드릴게요!
          </div>
        </div>
        <div className="MainPage__buttons">
          <div className="MainPage__button MainPage__button--login">로그인</div>
          <div className="MainPage__button MainPage__button--signup">
            회원가입
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
