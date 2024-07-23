import React from 'react';
import Logo from '../assets/SIMPLAYLogo.svg';
import HomeIcon from '../assets/HomeIcon.svg';
import MenuIcon from '../assets/MenuIcon.svg';
import SignoutIcon from '../assets/SignoutIcon.svg';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <div>
      <div className="absolute left-0 top-0 flex items-center justify-center p-4">
        <Link to="/main">
          <button type="button" className="flex flex-row items-center">
            <img
              className="h-[2.5rem] w-[2.5rem]"
              src={HomeIcon}
              alt="홈 아이콘"
            />
            <p className="ml-[5px] rounded text-[1.2rem] text-white">홈</p>
          </button>
        </Link>
        {/* <Link to="/list"> */}
        <button type="button" className="flex flex-row items-center">
          <img
            className="h-[2.5rem] w-[2.5rem]"
            src={MenuIcon}
            alt="메뉴 아이콘"
          />
          <p className="ml-[5px] rounded text-[1.2rem] text-white">목록</p>
        </button>
        {/* </Link> */}
      </div>
      <div className="absolute left-1/2 top-0 -translate-x-1/2 transform p-4 text-[1.2rem]">
        <p className="text-[2rem] text-white">Brandify</p>
      </div>
      <div className="absolute right-0 top-0 flex items-center p-4">
        <button
          type="button"
          className="flex flex-row items-center justify-center"
        >
          <img
            className="h-[2rem] w-[2rem]"
            src={SignoutIcon}
            alt="메뉴 아이콘"
          />{' '}
          <p className="ml-[5px] rounded text-[1.2rem] text-white">로그아웃</p>
        </button>
      </div>
    </div>
  );
}

export default NavBar;
