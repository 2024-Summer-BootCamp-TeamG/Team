import React from "react";
import DarkRoundButton from "../components/DarkRoundButton";
import DeepPurpleCircle from "../assets/DeepPurpleCircle.png";
import MintCircle from "../assets/MintCircle.svg";
import MintCircleSm from "../assets/MintCircleSm.svg";
import PurpleCircle from "../assets/PurpleCircle.svg";
import PurpleCircleSm from "../assets/PurpleCircleSm.png";
import PurpleTransCircle from "../assets/PurpleTransCircle.svg";
import AlbumCover from "../assets/Album.png";
import Logo from "../assets/SIMPLAYLogo.svg";
import HomeIcon from "../assets/HomeIcon.svg";
import MenuIcon from "../assets/MenuIcon.svg";
export default function MusicCoverGenerationPage() {
    const coordinates = [
        { src: MintCircle, left: "20%", top: "70%" },
        { src: DeepPurpleCircle, left: "10%", top: "60%" },
        { src: MintCircleSm, left: "40%", top: "20%" },
        { src: PurpleCircle, left: "40%", top: "60%" },
        { src: PurpleCircleSm, left: "20%", top: "15%" },
        { src: PurpleTransCircle, left: "10%", top: "30%" },
      ];
  return (
    <div className="relative flex flex-col items-center justify-center w-screen h-screen bg-cover bg-[#000000]">
      <div className="relative w-full h-full">
               <div className="absolute left-0 top-0 flex items-center space-x-4 p-4">
          <img src={HomeIcon} alt="홈 아이콘" />
          <img src={MenuIcon} alt="메뉴 아이콘" />
        </div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 p-4">
          <img src={Logo} alt="로고" />
        </div>

      {coordinates.map((circle, index) => (
          <img
            key={index}
            src={circle.src}
            alt="원"
            style={{
              position: "absolute",
              left: circle.left,
              top: circle.top,
              transform: "translate(-50%, -50%)"
            }}
          />
        ))}
        <div className="flex flex-col items-start justify-center min-h-screen ml-[190px]">
<div className="w-[600px] h-[700px] flex justify-center bg-gradient-to-b from-white to-black rounded-[40px] shadow border border-white backdrop-blur-[55px] opacity-50">
  <img src={AlbumCover} alt="앨범 커버" className=" flex h-[452px] w-[432px] mt-[80px] justify-center z-10"></img>
</div>
</div>
      {/* <img src={Background} alt="background" className="absolute w-full h-full object-cover" /> */}
      </div>
    </div>
  );
}
