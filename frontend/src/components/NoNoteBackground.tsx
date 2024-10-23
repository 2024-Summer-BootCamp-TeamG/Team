import { ReactNode } from 'react';

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

export default function NoNoteBackground({ children }: BackgroundProps) {
  const smallnote: CoordinateNote[] = [
    { src: smallNote, right: '90%', top: '70%' },
    { src: smallNote, left: '90%', top: '45%' },
    { src: smallNote, left: '70%', top: '15%' },
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

      <div className="relative z-10 flex h-full w-full items-center justify-center">
        {children}
      </div>
    </div>
  );
}
