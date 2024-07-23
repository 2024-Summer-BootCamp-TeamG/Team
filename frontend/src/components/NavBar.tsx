import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/SIMPLAYLogo.svg';
import HomeIcon from '../assets/HomeIcon.svg';
import MenuIcon from '../assets/MenuIcon.svg';
import SignoutIcon from '../assets/SignoutIcon.svg';
import { Link } from 'react-router-dom';

// CSRF 토큰을 가져오는 함수
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// CSRF 토큰 가져오기
const csrftoken = getCookie('csrftoken');

// axios 기본 설정
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.headers.common['X-CSRFToken'] = csrftoken;

function NavBar() {
  const navigate = useNavigate();

  async function logout() {
    try {
      const response = await axios.post(
        'http://localhost:8000/users/signout',
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`, // 인증 토큰을 헤더에 추가합니다.
          },
        },
      );
      if (response.status === 200) {
        console.log('Logged out successfully');
        localStorage.removeItem('token'); // 로그아웃 후 인증 토큰을 로컬 스토리지에서 제거합니다.
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error logging out', error);
    }

    navigate('/signin');
  }

  return (
    <>
      <div className="absolute left-0 top-0 flex items-center justify-center space-x-8 p-4">
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
      <div className="absolute left-1/2 top-0 -translate-x-1/2 transform p-4">
        <img src={Logo} alt="로고" />
      </div>
      <div className="absolute right-0 top-0 flex items-center p-4">
        <button type="button" className="flex flex-row" onClick={logout}>
          <img
            className="h-[2rem] w-[2rem]"
            src={SignoutIcon}
            alt="메뉴 아이콘"
          />{' '}
          <p className="ml-[5px] rounded text-[1.2rem] text-white">로그아웃</p>
        </button>
      </div>{' '}
    </>
  );
}

export default NavBar;
