import React from "react";
import NavBar from "../components/NavBar";



function ChooseColorPage() {
  return (
    <div className="relative flex w-screen h-screen flex-col items-center justify-center bg-black bg-cover">
      <div className="relative w-full h-full">
        <NavBar/>
        <div className=" text-white text-center text-4xl flex justify-center items-center mt-56">원하는 색상을 선택해주세요!</div>
        
        <div className="relative flex justify-center items-center text-center top-14">
          <div className="grid grid-cols-4 gap-9">
            <div className="relative w-[20rem] h-[9rem] rounded-xl text-white bg-red-500/80 hover:text-black hover:bg-white/80 transition-colors duration-300 flex justify-center items-center">RED</div>
            <div className="relative w-[20rem] h-[9rem] rounded-xl text-white bg-orange-400/80 hover:text-black hover:bg-white/80 transition-colors duration-300 flex justify-center items-center">ORANGE</div>
            <div className="relative w-[20rem] h-[9rem] rounded-xl text-white bg-yellow-300/80 hover:text-black hover:bg-white/80  transition-colors duration-300 flex justify-center items-center">YELLOW</div>
            <div className="relative w-[20rem] h-[9rem] rounded-xl text-white bg-gray-400/80 hover:text-black hover:bg-white/80  transition-colors duration-300 flex justify-center items-center">GRAY</div>
            <div className="relative w-[20rem] h-[9rem] rounded-xl text-white bg-green-500/80 hover:text-black hover:bg-white/70  transition-colors duration-300 flex justify-center items-center">GREEN</div>
            <div className="relative w-[20rem] h-[9rem] rounded-xl text-white bg-blue-600/80 hover:text-black hover:bg-white/70  transition-colors duration-300 flex justify-center items-center">BLUE</div>
            <div className="relative w-[20rem] h-[9rem] rounded-xl text-white bg-pink-400/80 hover:text-black hover:bg-white/70  transition-colors duration-300 flex justify-center items-center">PINK</div>
            <div className="relative w-[20rem] h-[9rem] rounded-xl text-white bg-cyan-200/80 hover:text-black hover:bg-white/70  transition-colors duration-300 flex justify-center items-center">AQUA</div>
            <div className="relative w-[20rem] h-[9rem] rounded-xl text-white bg-purple-400/80 hover:text-black hover:bg-white/70  transition-colors duration-300 flex justify-center items-center">PURPLE</div>
            <div className="relative w-[20rem] h-[9rem] rounded-xl text-black bg-white/80 hover:text-white hover:bg-black/70  transition-colors duration-300 border border-white flex justify-center items-center">WHITE</div>
            <div className="relative w-[20rem] h-[9rem] rounded-xl text-white bg-black/80 hover:text-black hover:bg-white/70 border border-white transition-colors duration-300 flex justify-center items-center">BLACK</div>
            <div className="relative w-[20rem] h-[9rem] rounded-xl text-white bg-gradient-to-tl from-fuchsia-500/80 via-teal-400/80 to-yellow-300/80  hover:text-black hover:bg-white/70  transition-colors duration-300 flex justify-center items-center">RANDOM</div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ChooseColorPage;