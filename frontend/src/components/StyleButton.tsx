import React, { useState } from 'react';

interface StyleButtonProps {
  buttonText?: string;
  className?: string;
  onClick?: () => void;
}

function StyleButton({
  buttonText = 'example',
  className = '',
  onClick,
}: StyleButtonProps) {
  const [isClicked, setIsClicked] = useState(false); // 클릭 상태를 관리하는 상태

  const handleClick = () => {
    setIsClicked(true); // 클릭 시 클릭 상태 변경
    if (onClick) {
      onClick(); // 클릭 이벤트 핸들러 실행
    }
  };

  return (
    <>
      <div
        className={`relative z-10 flex justify-center self-center rounded-[60px] border-2 border-white bg-gradient-to-b from-white/20 to-slate-400/10 shadow backdrop-blur-xl sm:mt-0 ${className} ${isClicked ? 'bg-white text-black' : ''}`}
      >
        <button
          type="button"
          className={`button-custom-stroke w-full rounded-[60px] border py-2 text-center text-[1.5rem] ${isClicked ? 'text-black' : 'text-white'} hover:bg-white hover:text-black`}
          onClick={handleClick}
        >
          {buttonText}
        </button>
      </div>
    </>
  );
}

export default StyleButton;
