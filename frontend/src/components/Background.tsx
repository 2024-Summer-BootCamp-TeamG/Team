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

// interface CoordinateCircle {
//   size: string;
//   left?: string;
//   right?: string;
//   top: string;
//   backgroundColor: string;
// }

interface CoordinateNote {
  src: string;
  left?: string;
  right?: string;
  top: string;
}

export default function Background({ children }: BackgroundProps) {
  // const coordinates: CoordinateCircle[] = [
  //   { size: '100px', left: '50%', top: '70%', backgroundColor: '#7fc8d6' },
  //   { size: '150px', left: '40%', top: '50%', backgroundColor: '#5d3fd3' },
  //   { size: '50px', left: '60%', top: '20%', backgroundColor: '#7fc8d6' },
  //   { size: '200px', left: '70%', top: '50%', backgroundColor: '#9370db' },
  //   { size: '75px', left: '40%', top: '15%', backgroundColor: '#9370db' },
  //   { size: '125px', left: '50%', top: '30%', backgroundColor: '#9370db' },
  // ];
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
    { src: smallNote, left: '50%', top: '80%' },
    { src: smallNote, left: '90%', top: '45%' },
    { src: smallNote, left: '25%', top: '90%' },
    { src: smallNote, left: '70%', top: '15%' },
    { src: smallNote, left: '10%', top: '70%' },
    { src: smallNote, left: '2%', top: '60%' },
    { src: smallNote, left: '25%', top: '90%' },
    { src: smallNote, left: '60%', top: '65%' },
    { src: smallNote, left: '50%', top: '30%' },
    { src: smallNote, left: '2%', top: '40%' },
  ];
  return (
    <div className="relative h-full w-full">
      {/* {coordinates.map((circle, index) => (
        <Circle
          key={index}
          size={circle.size}
          left={circle.left}
          top={circle.top}
          right={circle.right}
          backgroundColor={circle.backgroundColor}
        />
      ))} */}
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
