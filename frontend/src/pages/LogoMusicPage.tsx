import React from 'react';
import Background from '../components/Background.tsx';
import NavBar from '../components/NavBar.tsx';


function LogoMusicPage() {
  return (
    <div className="relative flex w-screen h-screen flex-col items-center justify-center bg-black bg-cover">
      <div className="relative w-full h-full">
        <Background>
          <NavBar/>
          <div className="absolute flex justify-center items-center h-[ 40rem] w-[70rem] rounded-[2.5rem] border border-white bg-gradient-to-b from-white/20 to-slate-400/10 backdrop-blur-xl"></div>
        
        </Background>
      </div>
    </div>
  );
}

export default LogoMusicPage; 