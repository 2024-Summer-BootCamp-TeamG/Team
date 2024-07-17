import React from 'react';

interface BlurTextareaProps {
  children: React.ReactNode;
  className?: string;
}

const BlurTextarea: React.FC<BlurTextareaProps> = ({ children, className }) => {
  return (
    <textarea
      className={`z-10 flex resize-none justify-center rounded-[40px] border-2 border-white bg-gradient-to-b from-white/20 to-slate-400/10 shadow backdrop-blur-xl ${className}`}
      style={{
        backdropFilter: 'blur(10px)', // 블러 효과 적용
        WebkitBackdropFilter: 'blur(10px)', // 사파리 지원을 위해 추가
      }}
    >
      {children}
    </textarea>
  );
};

export default BlurTextarea;
