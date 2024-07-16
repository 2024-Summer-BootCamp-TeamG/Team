import React from 'react';
import '../index.css';
function AlbumStyleButton({ buttonText = '다음' }) {
  return (
    <>
      <div className="bg-white/opacity-20 h-[80px] w-[200px] rounded-[19.39px]">
        <button
          type="button"
          className="button-custom-stroke h-[80px] w-[200px] rounded-full border px-20 py-2 text-center text-white"
        >
          {buttonText}
        </button>
      </div>
    </>
  );
}

export default AlbumStyleButton;
