import React from 'react';

function StyleButton({ buttonText = 'example', className = '' }) {
  return (
    <>
      <div
        className={`relative z-10 flex justify-center self-center rounded-[60px] border-2 border-white bg-gradient-to-b from-white/20 to-slate-400/10 shadow backdrop-blur-xl sm:mt-0 ${className}`}
      >
        <button
          type="button"
          className="button-custom-stroke w-full rounded-[60px] border py-2 text-center text-[1.5rem] text-white hover:bg-white hover:text-black"
        >
          {buttonText}
        </button>
      </div>
    </>
  );
}

export default StyleButton;
