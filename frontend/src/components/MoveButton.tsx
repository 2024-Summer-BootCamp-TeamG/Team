import React from 'react';
import '../index.css';
import './style.scss';
function MoveButton({ buttonText = '다음', className = '' }) {
  return (
    <>
      <div
        className={`w-[200px]relative z-10 flex h-[5rem] w-[12.5rem] justify-center self-center rounded-[60px] border-2 border-white bg-gradient-to-b from-white/20 to-slate-400/10 shadow backdrop-blur-xl sm:mt-0${className}`}
      >
        <button
          type="button"
          className="btn button-custom-stroke w-full rounded-[60px] border py-2 text-center text-[1.5rem] text-white hover:bg-white hover:text-black"
        >
          {buttonText}
        </button>
      </div>
    </>
  );
}

export default MoveButton;
