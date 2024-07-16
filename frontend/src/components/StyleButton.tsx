import React from 'react';

function StyleButton({ buttonText = 'example' }) {
  return (
    <>
      <div className="relative z-10 flex h-[145px] w-[335px] justify-center self-center rounded-[60px] border-2 border-white bg-gradient-to-b from-white/20 to-slate-400/10 shadow backdrop-blur-xl sm:mt-0">
        <button
          type="button"
          className="button-custom-stroke w-full rounded-[60px] border py-2 text-center text-[1.5rem] text-white"
        >
          {buttonText}
        </button>
      </div>
    </>
  );
}

export default StyleButton;
