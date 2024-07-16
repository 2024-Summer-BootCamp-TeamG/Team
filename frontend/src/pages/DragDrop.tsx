import React from 'react';
import Background from '../components/Background';
import NavBar from '../components/NavBar';

function DragDrop() {
  return (
    <Background>
      <NavBar />
      <div className="relative h-[67.5rem] w-[120rem]">
        <div className="absolute left-[21em] top-[15rem] h-[37.5rem] w-[37.5rem] rounded-full border-4 border-dashed border-black bg-white opacity-80 shadow backdrop-blur-sm" />
        <div className="bg-white/opacity-20 absolute left-[65.56rem] top-[29.13rem] h-[9.38rem] w-[44.88rem] rounded-[2.5rem] border-2 border-white opacity-50" />
        <button className="absolute left-[25rem] top-[56.25rem] h-[4.06rem] w-[30rem] rounded-[2.5rem] border-2 border-black bg-white text-center text-[2.5rem] text-black">
          앨범 생성 Start
        </button>
        <div className="center absolute left-[68.75rem] top-[31.5rem] font-['Inter'] text-3xl font-black tracking-wide text-cyan-50">
          지금부터 마음을 담음 앨범 만들기를 시작합니다!
          <br />
          앨범을 만들고 싶은 그림을 드래그 해주세요
        </div>
        <div className="h-[15.56rem] w-[20.69rem]">
          <svg
            width={96}
            height={84}
            viewBox="0 0 96 84"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-[591.5px] top-[476.5px]"
            preserveAspectRatio="none"
          >
            <path
              d="M90 0H6C4.4087 0 2.88258 0.632141 1.75736 1.75736C0.632141 2.88258 0 4.4087 0 6V78C0 79.5913 0.632141 81.1174 1.75736 82.2426C2.88258 83.3679 4.4087 84 6 84H90C91.5913 84 93.1174 83.3679 94.2426 82.2426C95.3679 81.1174 96 79.5913 96 78V6C96 4.4087 95.3679 2.88258 94.2426 1.75736C93.1174 0.632141 91.5913 0 90 0ZM6 78V6H90V78H6Z"
              fill="black"
            />
          </svg>
          <svg
            width={18}
            height={18}
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-[603.5px] top-[488.5px]"
            preserveAspectRatio="none"
          >
            <path
              d="M9 18C10.78 18 12.5201 17.4722 14.0001 16.4832C15.4802 15.4943 16.6337 14.0887 17.3149 12.4442C17.9961 10.7996 18.1743 8.99002 17.8271 7.24419C17.4798 5.49836 16.6226 3.89471 15.364 2.63604C14.1053 1.37737 12.5016 0.520203 10.7558 0.172936C9.00998 -0.17433 7.20038 0.00389957 5.55585 0.685088C3.91131 1.36628 2.5057 2.51983 1.51677 3.99987C0.52784 5.47991 0 7.21997 0 9C0 11.387 0.948212 13.6761 2.63604 15.364C4.32387 17.0518 6.61305 18 9 18ZM9 4.2C9.9506 4.19406 10.8816 4.47052 11.6749 4.99433C12.4682 5.51813 13.088 6.2657 13.456 7.14224C13.8239 8.01879 13.9232 8.98483 13.7414 9.91791C13.5596 10.851 13.1048 11.7091 12.4347 12.3834C11.7647 13.0577 10.9094 13.5178 9.97752 13.7055C9.0456 13.8931 8.07895 13.7998 7.20011 13.4374C6.32128 13.075 5.56984 12.4598 5.04107 11.6698C4.5123 10.8798 4.23002 9.95063 4.23 9C4.23787 7.73735 4.74294 6.52865 5.63579 5.6358C6.52864 4.74295 7.73734 4.23787 9 4.23V4.2Z"
              fill="black"
            />
          </svg>
          <svg
            width={72}
            height={33}
            viewBox="0 0 72 33"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-[603.5px] top-[509.5px]"
            preserveAspectRatio="none"
          >
            <path
              d="M50.412 0.884373L34.2658 17.3071L22.3056 5.14213C21.7454 4.57569 20.9876 4.25776 20.1977 4.25776C19.4078 4.25776 18.6499 4.57569 18.0897 5.14213L0 23.785V32.3917L20.3023 11.7416L30.1395 21.5953L18.9269 33H27.1495L52.4153 7.30141L72 27.1304V18.5541L54.6279 0.884373C54.0677 0.317937 53.3099 0 52.5199 0C51.73 0 50.9722 0.317937 50.412 0.884373Z"
              fill="black"
            />
          </svg>
          <div className="left-[24.1rem] top-[29.03rem]" />
          <p className="absolute left-[29.38rem] top-[37.38rem] h-[3.75rem] w-[20.69rem] text-center text-2xl text-black">
            사진 업로드하기
          </p>
          <p className="absolute left-[29.38rem] top-[40.31rem] h-[3.75rem] w-[20.69rem] text-center text-2xl text-black">
            이미지를 드래그해주세요!
          </p>
          <svg
            width={56}
            height={56}
            viewBox="0 0 56 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-[652.5px] top-[453.5px]"
            preserveAspectRatio="xMidYMid meet"
          >
            <circle cx={28} cy={28} r={28} fill="black" />
          </svg>
          <svg
            width={30}
            height={30}
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-[667.5px] top-[468.5px]"
            preserveAspectRatio="none"
          >
            <path
              d="M27.8571 17.1429H17.1429V27.8571C17.1429 28.4255 16.9171 28.9705 16.5152 29.3724C16.1134 29.7742 15.5683 30 15 30C14.4317 30 13.8866 29.7742 13.4848 29.3724C13.0829 28.9705 12.8571 28.4255 12.8571 27.8571V17.1429H2.14286C1.57454 17.1429 1.02949 16.9171 0.627629 16.5152C0.225765 16.1134 0 15.5683 0 15C0 14.4317 0.225765 13.8866 0.627629 13.4848C1.02949 13.0829 1.57454 12.8571 2.14286 12.8571H12.8571V2.14286C12.8571 1.57454 13.0829 1.02949 13.4848 0.627628C13.8866 0.225764 14.4317 0 15 0C15.5683 0 16.1134 0.225764 16.5152 0.627628C16.9171 1.02949 17.1429 1.57454 17.1429 2.14286V12.8571H27.8571C28.4255 12.8571 28.9705 13.0829 29.3724 13.4848C29.7742 13.8866 30 14.4317 30 15C30 15.5683 29.7742 16.1134 29.3724 16.5152C28.9705 16.9171 28.4255 17.1429 27.8571 17.1429Z"
              fill="#F5F5F5"
            />
          </svg>
        </div>
        ;
      </div>
    </Background>
  );
}

export default DragDrop;
