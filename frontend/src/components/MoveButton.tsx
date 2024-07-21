import React from 'react';
import '../index.css';
import './style.scss';
function MoveButton({ buttonText = '다음', className = '' }) {
  return (
    <>
      <div
        className={`relative z-10 flex h-[5rem] w-[10rem] w-[12.5rem] justify-center self-center sm:mt-0${className}`}
      >
        <button
          type="button"
          className="btn button-custom-stroke w-full rounded-[60px] border py-2 text-center text-[1.5rem] font-bold text-white hover:bg-white hover:text-black"
        >
          {buttonText}
        </button>
      </div>
    </>
  );
}

export default MoveButton;
