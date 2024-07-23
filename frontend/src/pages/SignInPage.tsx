import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Background from '../components/Background';
import NavBar from '../components/NavBar';

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

// axios 기본 설정
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.headers.common['X-CSRFToken'] = getCookie('csrftoken');

const Input: React.FC<{
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ type, placeholder, value, onChange }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="custom-placeholder h-full w-full rounded-[1.25rem] border-gray-300 bg-white bg-opacity-30 p-2 placeholder-black focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

const Button: React.FC<{
  type: 'button' | 'submit' | 'reset';
  label: string;
  onClick: () => void;
}> = ({ type, label, onClick }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="h-[3.75rem] w-full rounded-[1.5rem] bg-white px-4 py-2 text-black hover:bg-black/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
    >
      {label}
    </button>
  );
};

function SignInPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8000/users/signin',
        {
          email: username,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'), // CSRF 토큰을 헤더에 추가합니다.
          },
        },
      );

      if (response.status === 200) {
        // 로그인 성공
        alert('로그인이 성공적으로 완료되었습니다.');

        // 토큰 추출 및 저장
        const token = response.data.token;
        localStorage.setItem('token', token);

        // axios 기본 헤더 설정
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        navigate('/pictureupload');
      } else {
        // 로그인 실패
        alert('로그인에 실패했습니다.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          alert(
            `로그인 도중 오류가 발생했습니다: ${error.response.data.message || error.response.data}`,
          );
        } else {
          alert('로그인 도중 오류가 발생했습니다.');
        }
        console.error('There was an error!', error);
      }
    }
  };

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center bg-cover">
      <Background>
        <NavBar />
        <div className="absolute h-[67.5rem] w-[120rem]">
          <div className="absolute left-[35rem] top-[17.19rem] h-[53.13rem] w-[50rem] rounded-[2.5rem] border-2 border-white bg-white/30 opacity-60 shadow backdrop-blur-[3.44rem]" />
          <form onSubmit={handleSubmit}>
            <div className="bg-white/opacity-20 absolute left-[47.5rem] top-[47rem] h-[3.75rem] w-[25rem] rounded-[1.25rem] border-2 border-white">
              <Input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="bg-white/opacity-20 absolute left-[47.5rem] top-[40rem] h-[3.75rem] w-[25rem] rounded-[1.25rem] border-2 border-white">
              <Input
                type="text"
                placeholder="아이디"
                value={username}
                onChange={handleUsernameChange}
              />
            </div>
            <div className="font-['Cafe24 Danjunghae'] absolute left-[52rem] top-[24rem] text-center text-[6rem] font-normal text-white">
              로그인
            </div>
            <div className="font-['Cafe24 Danjunghae'] absolute left-[47.5rem] top-[62.5rem] flex w-[25rem] items-center justify-center rounded-[1.25rem] text-xl font-normal text-black">
              <Button type="submit" label="로그인하기" onClick={handleSubmit} />
            </div>
          </form>
        </div>
      </Background>
    </div>
  );
}

export default SignInPage;
