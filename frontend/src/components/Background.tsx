import { ReactNode } from 'react';
import FullNote1 from '../assets/MusicNote/FullNote1.svg';
import FullNote2 from '../assets/MusicNote/FullNote2.svg';
import FullNote3 from '../assets/MusicNote/FullNote3.svg';
import FullNote4 from '../assets/MusicNote/FullNote4.svg';
import FullNote5 from '../assets/MusicNote/FullNote5.svg';
import FullNote6 from '../assets/MusicNote/FullNote6.svg';
import FullNote7 from '../assets/MusicNote/FullNote7.svg';
import smallNote from '../assets/smallNote.png';
interface BackgroundProps {
  children: ReactNode;
}

interface CoordinateNote {
  src: string;
  left?: string;
  right?: string;
  top: string;
}

export default function Background({ children }: BackgroundProps) {
  const notes: CoordinateNote[] = [
    { src: FullNote1, right: '90%', top: '70%' },
    { src: FullNote2, left: '10%', top: '80%' },
    { src: FullNote3, left: '90%', top: '70%' },
    { src: FullNote4, left: '25%', top: '90%' },
    { src: FullNote5, left: '80%', top: '15%' },
    { src: FullNote6, left: '10%', top: '30%' },
    { src: FullNote7, left: '2%', top: '40%' },
  ];

  const smallnote: CoordinateNote[] = [
    { src: smallNote, right: '90%', top: '70%' },
    { src: smallNote, left: '90%', top: '45%' },
    { src: smallNote, left: '70%', top: '70%' },
    { src: smallNote, left: '80%', top: '90%' },

    { src: smallNote, left: '20%', top: '40%' },
  ];
  return (
    <div className="relative h-full w-full">
      {smallnote.map((note, index) => (
        <img
          key={index}
          src={note.src}
          alt="음표"
          style={{
            position: 'absolute',
            left: note.left,
            top: note.top,
          }}
        />
      ))}
      {notes.map((note, index) => (
        <img
          key={index}
          src={note.src}
          alt="음표"
          className="animate-float"
          style={{
            position: 'absolute',
            left: note.left,
            top: note.top,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        {children}
      </div>
    </div>
  );
}
